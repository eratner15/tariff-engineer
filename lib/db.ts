/**
 * Database Utility Library
 *
 * Provides helper functions for all database operations using Vercel Postgres.
 * Includes connection management, query helpers, and type-safe accessors.
 */

import { sql } from '@vercel/postgres';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HTSCode {
  id: number;
  hts_code: string;
  description: string;
  general_rate: string;
  special_rate: string;
  other_rate: string;
  chapter: string;
  heading: string;
  subheading: string;
  indent: number;
  created_at: Date;
  updated_at: Date;
}

export interface Ruling {
  id: string;
  ruling_type: string;
  url: string;
  ruling_date: Date;
  hts_codes: string[];
  product_description: string;
  classification: string;
  rationale: string;
  keywords: string[];
  embedding: number[];
  created_at: Date;
  scraped_at: Date;
}

export interface Strategy {
  id: number;
  name: string;
  category: string;
  current_hts: string;
  current_rate: string;
  target_hts: string;
  target_rate: string;
  modification_required: string;
  supporting_rulings: string[];
  savings_percentage: number;
  confidence: string;
  is_active: boolean;
  notes: string;
  created_at: Date;
}

export interface Audit {
  id: string;
  product_description: string;
  matched_hts: string[];
  matched_rulings: string[];
  strategies_found: number;
  estimated_savings: number;
  user_email: string | null;
  ip_hash: string | null;
  created_at: Date;
}

export interface Lead {
  id: string;
  email: string;
  source: string;
  first_audit_id: string | null;
  created_at: Date;
}

// ============================================================================
// HTS OPERATIONS
// ============================================================================

/**
 * Search HTS codes by keyword
 */
export async function searchHTSCodes(query: string, limit: number = 20) {
  try {
    const result = await sql.query(
      'SELECT * FROM search_hts($1, $2)',
      [query, limit]
    );
    return result.rows as HTSCode[];
  } catch (error) {
    console.error('Error searching HTS codes:', error);
    throw error;
  }
}

/**
 * Get HTS code by exact code
 */
export async function getHTSByCode(htsCode: string) {
  try {
    const result = await sql.query(
      'SELECT * FROM hts_codes WHERE hts_code = $1',
      [htsCode]
    );
    return result.rows[0] as HTSCode | undefined;
  } catch (error) {
    console.error('Error getting HTS code:', error);
    throw error;
  }
}

/**
 * Batch insert HTS codes
 */
export async function insertHTSCodes(codes: Partial<HTSCode>[]) {
  try {
    const values = codes.map((code, idx) => {
      const offset = idx * 9;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9})`;
    }).join(', ');

    const params = codes.flatMap(code => [
      code.hts_code,
      code.description,
      code.general_rate,
      code.special_rate,
      code.other_rate,
      code.chapter,
      code.heading,
      code.subheading,
      code.indent
    ]);

    await sql.query(
      `INSERT INTO hts_codes (hts_code, description, general_rate, special_rate, other_rate, chapter, heading, subheading, indent)
       VALUES ${values}
       ON CONFLICT (hts_code) DO UPDATE SET
         description = EXCLUDED.description,
         general_rate = EXCLUDED.general_rate,
         updated_at = NOW()`,
      params
    );
  } catch (error) {
    console.error('Error inserting HTS codes:', error);
    throw error;
  }
}

// ============================================================================
// RULINGS OPERATIONS
// ============================================================================

/**
 * Search rulings by semantic similarity (vector search)
 */
export async function searchRulingsSemantic(
  queryEmbedding: number[],
  matchThreshold: number = 0.5,
  matchCount: number = 10
) {
  try {
    const result = await sql.query(
      'SELECT * FROM search_rulings_semantic($1::vector, $2, $3)',
      [JSON.stringify(queryEmbedding), matchThreshold, matchCount]
    );
    return result.rows;
  } catch (error) {
    console.error('Error searching rulings semantically:', error);
    throw error;
  }
}

/**
 * Search rulings by HTS code prefix
 */
export async function searchRulingsByHTS(htsPrefix: string, limit: number = 20) {
  try {
    const result = await sql.query(
      'SELECT * FROM search_rulings_by_hts($1, $2)',
      [htsPrefix, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Error searching rulings by HTS:', error);
    throw error;
  }
}

/**
 * Get ruling by ID
 */
export async function getRulingById(rulingId: string) {
  try {
    const result = await sql.query(
      'SELECT * FROM rulings WHERE id = $1',
      [rulingId]
    );
    return result.rows[0] as Ruling | undefined;
  } catch (error) {
    console.error('Error getting ruling:', error);
    throw error;
  }
}

/**
 * Insert or update a ruling
 */
export async function upsertRuling(ruling: Partial<Ruling>) {
  try {
    await sql.query(
      `INSERT INTO rulings (id, ruling_type, url, ruling_date, hts_codes, product_description, classification, rationale, keywords, embedding)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::vector)
       ON CONFLICT (id) DO UPDATE SET
         ruling_type = EXCLUDED.ruling_type,
         url = EXCLUDED.url,
         ruling_date = EXCLUDED.ruling_date,
         hts_codes = EXCLUDED.hts_codes,
         product_description = EXCLUDED.product_description,
         classification = EXCLUDED.classification,
         rationale = EXCLUDED.rationale,
         keywords = EXCLUDED.keywords,
         embedding = EXCLUDED.embedding,
         scraped_at = NOW()`,
      [
        ruling.id,
        ruling.ruling_type,
        ruling.url,
        ruling.ruling_date,
        ruling.hts_codes,
        ruling.product_description,
        ruling.classification,
        ruling.rationale,
        ruling.keywords,
        JSON.stringify(ruling.embedding)
      ]
    );
  } catch (error) {
    console.error('Error upserting ruling:', error);
    throw error;
  }
}

/**
 * Check if ruling already exists
 */
export async function rulingExists(rulingId: string): Promise<boolean> {
  try {
    const result = await sql.query(
      'SELECT id FROM rulings WHERE id = $1',
      [rulingId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking ruling existence:', error);
    throw error;
  }
}

// ============================================================================
// STRATEGIES OPERATIONS
// ============================================================================

/**
 * Get all active strategies
 */
export async function getAllStrategies() {
  try {
    const result = await sql.query(
      'SELECT * FROM strategies WHERE is_active = true ORDER BY savings_percentage DESC'
    );
    return result.rows as Strategy[];
  } catch (error) {
    console.error('Error getting strategies:', error);
    throw error;
  }
}

/**
 * Get strategies for a specific HTS chapter
 */
export async function getStrategiesForChapter(chapter: string) {
  try {
    const result = await sql.query(
      'SELECT * FROM get_strategies_for_chapter($1)',
      [chapter]
    );
    return result.rows as Strategy[];
  } catch (error) {
    console.error('Error getting strategies for chapter:', error);
    throw error;
  }
}

/**
 * Upsert a strategy
 */
export async function upsertStrategy(strategy: Partial<Strategy>) {
  try {
    await sql.query(
      `INSERT INTO strategies (name, category, current_hts, current_rate, target_hts, target_rate, modification_required, supporting_rulings, savings_percentage, confidence, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (name) DO UPDATE SET
         category = EXCLUDED.category,
         current_hts = EXCLUDED.current_hts,
         current_rate = EXCLUDED.current_rate,
         target_hts = EXCLUDED.target_hts,
         target_rate = EXCLUDED.target_rate,
         modification_required = EXCLUDED.modification_required,
         supporting_rulings = EXCLUDED.supporting_rulings,
         savings_percentage = EXCLUDED.savings_percentage,
         confidence = EXCLUDED.confidence,
         notes = EXCLUDED.notes`,
      [
        strategy.name,
        strategy.category,
        strategy.current_hts,
        strategy.current_rate,
        strategy.target_hts,
        strategy.target_rate,
        strategy.modification_required,
        strategy.supporting_rulings,
        strategy.savings_percentage,
        strategy.confidence,
        strategy.notes
      ]
    );
  } catch (error) {
    console.error('Error upserting strategy:', error);
    throw error;
  }
}

// ============================================================================
// AUDITS OPERATIONS
// ============================================================================

/**
 * Create an audit record
 */
export async function createAudit(audit: Partial<Audit>) {
  try {
    const result = await sql.query(
      `INSERT INTO audits (product_description, matched_hts, matched_rulings, strategies_found, estimated_savings, user_email, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        audit.product_description,
        audit.matched_hts,
        audit.matched_rulings,
        audit.strategies_found,
        audit.estimated_savings,
        audit.user_email,
        audit.ip_hash
      ]
    );
    return result.rows[0].id as string;
  } catch (error) {
    console.error('Error creating audit:', error);
    throw error;
  }
}

/**
 * Get total number of audits
 */
export async function getTotalAudits(): Promise<number> {
  try {
    const result = await sql.query('SELECT get_total_audits() as total');
    return parseInt(result.rows[0].total);
  } catch (error) {
    console.error('Error getting total audits:', error);
    return 0;
  }
}

// ============================================================================
// LEADS OPERATIONS
// ============================================================================

/**
 * Capture an email lead
 */
export async function captureLead(email: string, source: string, auditId?: string) {
  try {
    await sql.query(
      `INSERT INTO leads (email, source, first_audit_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [email, source, auditId]
    );
  } catch (error) {
    console.error('Error capturing lead:', error);
    throw error;
  }
}

/**
 * Get total number of leads
 */
export async function getTotalLeads(): Promise<number> {
  try {
    const result = await sql.query('SELECT COUNT(*) as total FROM leads');
    return parseInt(result.rows[0].total);
  } catch (error) {
    console.error('Error getting total leads:', error);
    return 0;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    await sql.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Get database statistics
 */
export async function getStats() {
  try {
    const [htsCount, rulingsCount, strategiesCount, auditsCount, leadsCount] = await Promise.all([
      sql.query('SELECT COUNT(*) as count FROM hts_codes'),
      sql.query('SELECT COUNT(*) as count FROM rulings'),
      sql.query('SELECT COUNT(*) as count FROM strategies WHERE is_active = true'),
      sql.query('SELECT COUNT(*) as count FROM audits'),
      sql.query('SELECT COUNT(*) as count FROM leads'),
    ]);

    return {
      htsCodes: parseInt(htsCount.rows[0].count),
      rulings: parseInt(rulingsCount.rows[0].count),
      strategies: parseInt(strategiesCount.rows[0].count),
      audits: parseInt(auditsCount.rows[0].count),
      leads: parseInt(leadsCount.rows[0].count),
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
}
