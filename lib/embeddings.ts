/**
 * Embeddings Utility
 *
 * Provides functions for creating and working with text embeddings using OpenAI.
 * Used for semantic search of CBP rulings.
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Model configuration
 */
export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const EMBEDDING_DIMENSION = 1536;

/**
 * Create an embedding vector for a text string
 *
 * @param text - The text to embed (max ~8000 tokens)
 * @returns Array of numbers representing the embedding vector
 */
export async function createEmbedding(text: string): Promise<number[]> {
  try {
    // Truncate text if too long (OpenAI has ~8191 token limit for text-embedding-3-small)
    const truncatedText = text.substring(0, 8000);

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: truncatedText,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error: any) {
    console.error('Error creating embedding:', error.message);
    throw new Error(`Failed to create embedding: ${error.message}`);
  }
}

/**
 * Create embeddings for multiple texts in batch
 *
 * @param texts - Array of texts to embed
 * @returns Array of embedding vectors
 */
export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    // Truncate all texts
    const truncatedTexts = texts.map(t => t.substring(0, 8000));

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: truncatedTexts,
      encoding_format: 'float',
    });

    return response.data.map(item => item.embedding);
  } catch (error: any) {
    console.error('Error creating batch embeddings:', error.message);
    throw new Error(`Failed to create batch embeddings: ${error.message}`);
  }
}

/**
 * Calculate cosine similarity between two vectors
 *
 * @param a - First embedding vector
 * @param b - Second embedding vector
 * @returns Similarity score (0-1, higher is more similar)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Prepare text for embedding by combining relevant fields
 *
 * For CBP rulings, we want to embed a combination of:
 * - Product description
 * - Classification decision
 * - Rationale
 *
 * @param fields - Object with text fields to combine
 * @returns Combined text optimized for embedding
 */
export function prepareRulingTextForEmbedding(fields: {
  productDescription?: string;
  classification?: string;
  rationale?: string;
}): string {
  const parts: string[] = [];

  if (fields.productDescription) {
    parts.push(`Product: ${fields.productDescription}`);
  }

  if (fields.classification) {
    parts.push(`Classification: ${fields.classification}`);
  }

  if (fields.rationale) {
    // Truncate rationale if very long
    const rationale = fields.rationale.substring(0, 2000);
    parts.push(`Rationale: ${rationale}`);
  }

  return parts.join('\n\n');
}

/**
 * Test if OpenAI API key is configured
 */
export function isEmbeddingsConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Get embedding cost estimate
 *
 * @param characterCount - Total characters to embed
 * @returns Estimated cost in USD
 */
export function estimateEmbeddingCost(characterCount: number): number {
  // text-embedding-3-small costs $0.02 per 1M tokens
  // Rough estimate: 1 token ≈ 4 characters
  const estimatedTokens = characterCount / 4;
  const costPerMillionTokens = 0.02;
  return (estimatedTokens / 1_000_000) * costPerMillionTokens;
}
