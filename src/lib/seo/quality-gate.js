/**
 * Programmatic Quality Scoring (0 - 100)
 * Evaluates whether a page has sufficient unique content and value to be indexed by search engines.
 */
export function calculateSEOQualityScore({
  title,
  description,
  hasUniqueContent,
  hasValidProduct,
  hasValidLocation,
  internalLinksCount,
}) {
  let score = 0;

  // Technical & Metadata (30 points)
  if (title && title.length >= 20 && title.length <= 70) score += 15;
  if (description && description.length >= 50 && description.length <= 170) score += 15;

  // Content Quality & Value (40 points)
  if (hasUniqueContent) score += 20;
  if (hasValidProduct) score += 20;

  // Internal Linking & Relevance (30 points)
  if (internalLinksCount >= 3) score += 15;
  if (hasValidLocation) score += 15;

  return score;
}

export function shouldIndexPage(qualityScore) {
  return qualityScore >= 50;
}
