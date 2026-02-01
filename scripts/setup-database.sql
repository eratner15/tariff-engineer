-- Tariff Engineer Production Database Schema
-- For Vercel Postgres / PostgreSQL with pgvector

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- HTS CODES TABLE (Harmonized Tariff Schedule)
-- ============================================================================
CREATE TABLE IF NOT EXISTS hts_codes (
  id SERIAL PRIMARY KEY,
  hts_code TEXT UNIQUE NOT NULL,
  description TEXT,
  general_rate TEXT,
  special_rate TEXT,
  other_rate TEXT,
  chapter TEXT,
  heading TEXT,
  subheading TEXT,
  indent INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast HTS search
CREATE INDEX IF NOT EXISTS idx_hts_code ON hts_codes(hts_code);
CREATE INDEX IF NOT EXISTS idx_hts_description_trgm ON hts_codes USING gin(description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_hts_chapter ON hts_codes(chapter);

-- ============================================================================
-- CBP RULINGS TABLE (Real government precedent data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS rulings (
  id TEXT PRIMARY KEY,
  ruling_type TEXT, -- 'NY' (New York) or 'HQ' (Headquarters)
  url TEXT,
  ruling_date DATE,
  hts_codes TEXT[], -- Array of HTS codes mentioned in ruling
  product_description TEXT,
  classification TEXT,
  rationale TEXT,
  keywords TEXT[],
  embedding vector(1536), -- OpenAI text-embedding-3-small dimension
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scraped_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for rulings search
CREATE INDEX IF NOT EXISTS idx_rulings_hts ON rulings USING gin(hts_codes);
CREATE INDEX IF NOT EXISTS idx_rulings_date ON rulings(ruling_date DESC);
CREATE INDEX IF NOT EXISTS idx_rulings_type ON rulings(ruling_type);
CREATE INDEX IF NOT EXISTS idx_rulings_description_trgm ON rulings USING gin(product_description gin_trgm_ops);

-- Vector similarity index (IVFFlat for speed with large datasets)
CREATE INDEX IF NOT EXISTS idx_rulings_embedding ON rulings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ============================================================================
-- TARIFF ENGINEERING STRATEGIES TABLE (Curated opportunities)
-- ============================================================================
CREATE TABLE IF NOT EXISTS strategies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT, -- 'footwear', 'jewelry', 'electronics', 'bags', 'wearables', etc.
  current_hts TEXT,
  current_rate TEXT,
  target_hts TEXT,
  target_rate TEXT,
  modification_required TEXT,
  supporting_rulings TEXT[], -- Array of ruling IDs
  savings_percentage DECIMAL,
  confidence TEXT, -- 'high', 'medium', 'low'
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category-based strategy lookup
CREATE INDEX IF NOT EXISTS idx_strategies_category ON strategies(category);
CREATE INDEX IF NOT EXISTS idx_strategies_current_hts ON strategies(current_hts);

-- ============================================================================
-- AUDITS TABLE (Analytics tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_description TEXT,
  matched_hts TEXT[],
  matched_rulings TEXT[],
  strategies_found INTEGER,
  estimated_savings DECIMAL,
  user_email TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_email ON audits(user_email);

-- ============================================================================
-- LEADS TABLE (Email capture for marketing)
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT, -- 'audit', 'newsletter', 'pdf_download'
  first_audit_id UUID REFERENCES audits(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lead tracking
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function: Search HTS codes by keyword with trigram similarity
CREATE OR REPLACE FUNCTION search_hts(query_text TEXT, result_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  hts_code TEXT,
  description TEXT,
  general_rate TEXT,
  special_rate TEXT,
  similarity REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.hts_code,
    h.description,
    h.general_rate,
    h.special_rate,
    similarity(h.description, query_text) AS similarity
  FROM hts_codes h
  WHERE h.description ILIKE '%' || query_text || '%'
     OR h.hts_code LIKE query_text || '%'
  ORDER BY similarity(h.description, query_text) DESC
  LIMIT result_limit;
END;
$$;

-- Function: Semantic search rulings by embedding vector
CREATE OR REPLACE FUNCTION search_rulings_semantic(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id TEXT,
  product_description TEXT,
  classification TEXT,
  hts_codes TEXT[],
  ruling_date DATE,
  url TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.product_description,
    r.classification,
    r.hts_codes,
    r.ruling_date,
    r.url,
    1 - (r.embedding <=> query_embedding) AS similarity
  FROM rulings r
  WHERE 1 - (r.embedding <=> query_embedding) > match_threshold
  ORDER BY r.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function: Search rulings by HTS code prefix
CREATE OR REPLACE FUNCTION search_rulings_by_hts(hts_prefix TEXT, result_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  id TEXT,
  product_description TEXT,
  classification TEXT,
  hts_codes TEXT[],
  ruling_date DATE,
  url TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.product_description,
    r.classification,
    r.hts_codes,
    r.ruling_date,
    r.url
  FROM rulings r
  WHERE EXISTS (
    SELECT 1 FROM unnest(r.hts_codes) AS code
    WHERE code LIKE hts_prefix || '%'
  )
  ORDER BY r.ruling_date DESC
  LIMIT result_limit;
END;
$$;

-- Function: Get strategies for HTS chapter
CREATE OR REPLACE FUNCTION get_strategies_for_chapter(chapter_code TEXT)
RETURNS SETOF strategies
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM strategies
  WHERE current_hts LIKE chapter_code || '%'
    AND is_active = true
  ORDER BY savings_percentage DESC;
END;
$$;

-- Function: Get total audit count (for analytics)
CREATE OR REPLACE FUNCTION get_total_audits()
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  total BIGINT;
BEGIN
  SELECT COUNT(*) INTO total FROM audits;
  RETURN total;
END;
$$;

-- ============================================================================
-- INITIALIZATION COMPLETE
-- ============================================================================
-- Schema version: 1.0
-- Last updated: 2025-01-31
