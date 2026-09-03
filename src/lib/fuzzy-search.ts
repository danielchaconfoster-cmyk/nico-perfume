/**
 * Intelligent Fuzzy & Phonetic Search for Perfumes
 * Handles typos, accent removal, concatenated numbers (9pm -> 9 pm),
 * and common fragrance acronyms (YSL, JPG, CH, D&G).
 */

// Common acronyms and synonyms in perfumery
const SYNONYMS: Record<string, string> = {
  'ysl': 'yves saint laurent',
  'jpg': 'jean paul gaultier',
  'ch': 'carolina herrera',
  'dg': 'dolce gabbana',
  'd&g': 'dolce gabbana',
  'ck': 'calvin klein',
  '9pm': '9 pm',
  'no 5': 'n 5',
  'n°5': 'n 5',
  'n° 5': 'n 5',
  'versache': 'versace',
  'erera': 'herrera',
  'sauvaj': 'sauvage',
};

// Normalize text: remove accents, special chars, extra spaces
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents (é -> e, á -> a)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // replace symbols with space
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein distance for fuzzy typo tolerance
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Checks if target matches query token with typo tolerance
 */
function tokenMatches(targetWord: string, queryToken: string): boolean {
  if (targetWord.includes(queryToken)) return true;
  if (queryToken.includes(targetWord) && targetWord.length >= 4) return true;

  // For short words (1-3 chars), require exact match
  if (queryToken.length <= 3) return false;

  // For medium words (4-6 chars), allow 1 typo
  const maxDistance = queryToken.length <= 6 ? 1 : 2;
  return levenshteinDistance(targetWord, queryToken) <= maxDistance;
}

/**
 * Main fuzzy search matcher
 * Returns true if candidate perfume matches user query
 */
export function fuzzyMatchPerfume(
  perfume: {
    name: string;
    brand: string;
    fullName?: string;
    sku?: string;
    allNotes?: string[];
  },
  searchQuery: string
): boolean {
  if (!searchQuery || !searchQuery.trim()) return true;

  let cleanQuery = normalizeText(searchQuery);

  // Apply acronym replacements if query contains them
  for (const [acronym, replacement] of Object.entries(SYNONYMS)) {
    const regex = new RegExp(`\\b${acronym}\\b`, 'g');
    cleanQuery = cleanQuery.replace(regex, replacement);
  }

  const queryTokens = cleanQuery.split(' ').filter(t => t.length > 0);
  if (queryTokens.length === 0) return true;

  // Build target corpus string
  const corpus = [
    perfume.name,
    perfume.brand,
    perfume.fullName || '',
    perfume.sku || '',
    ...(perfume.allNotes || []),
  ].map(s => normalizeText(s)).join(' ');

  // Direct full substring match shortcut (fast path)
  if (corpus.includes(cleanQuery)) return true;

  const targetWords = corpus.split(' ').filter(w => w.length > 0);

  // Every token in query must match at least one word in target
  return queryTokens.every(queryToken => {
    // Exact or substring match in corpus
    if (corpus.includes(queryToken)) return true;

    // Fuzzy match against individual words in corpus
    return targetWords.some(targetWord => tokenMatches(targetWord, queryToken));
  });
}
