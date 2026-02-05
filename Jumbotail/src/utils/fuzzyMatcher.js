const levenshtein = require('fast-levenshtein');

/**
 * Fuzzy Matcher - Handles typos and spelling mistakes
 * Uses Levenshtein distance algorithm
 */

/**
 * Common brand names and their variations
 * Used for fuzzy matching
 */
const brandVariations = {
    'iphone': ['ifone', 'iphon', 'aifone', 'ipone', 'ifonn'],
    'samsung': ['samsang', 'samsum', 'samsun', 'samsng'],
    'oneplus': ['one plus', 'onepls', 'oneplus', '1plus'],
    'xiaomi': ['shaomi', 'shayomi', 'xiomi', 'mi'],
    'realme': ['relme', 'realmi', 'reelme'],
    'oppo': ['opo', 'opppo'],
    'vivo': ['vivo', 'vvo'],
    'apple': ['aple', 'appel', 'appl'],
    'dell': ['del', 'dele'],
    'hp': ['hewlett packard', 'hewlet'],
    'lenovo': ['lenovo', 'lenvo', 'lenova'],
    'asus': ['asus', 'asuss', 'asus'],
    'acer': ['acer', 'accer']
};

/**
 * Calculates similarity between two strings (0-1)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score (0 = no match, 1 = exact match)
 */
const calculateSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;

    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    // Exact match
    if (s1 === s2) return 1.0;

    // Calculate Levenshtein distance
    const distance = levenshtein.get(s1, s2);
    const maxLength = Math.max(s1.length, s2.length);

    // Convert distance to similarity (0-1)
    const similarity = 1 - (distance / maxLength);

    return similarity;
};

/**
 * Finds fuzzy matches for a query term
 * @param {string} queryTerm - Search term
 * @param {Array<string>} candidates - List of possible matches
 * @param {number} threshold - Minimum similarity threshold (default 0.7)
 * @returns {Array} - Array of matches with scores
 */
const findFuzzyMatches = (queryTerm, candidates, threshold = 0.7) => {
    if (!queryTerm || !candidates || candidates.length === 0) {
        return [];
    }

    const matches = candidates
        .map(candidate => ({
            term: candidate,
            score: calculateSimilarity(queryTerm, candidate)
        }))
        .filter(match => match.score >= threshold)
        .sort((a, b) => b.score - a.score);

    return matches;
};

/**
 * Corrects common brand name typos
 * @param {string} query - User's search query
 * @returns {string} - Corrected query
 */
const correctBrandTypos = (query) => {
    if (!query) return '';

    let correctedQuery = query.toLowerCase();

    // Check each brand and its variations
    Object.keys(brandVariations).forEach(correctBrand => {
        const variations = brandVariations[correctBrand];

        variations.forEach(variation => {
            // Use word boundaries to avoid partial replacements
            const regex = new RegExp(`\\b${variation}\\b`, 'gi');
            if (regex.test(correctedQuery)) {
                correctedQuery = correctedQuery.replace(regex, correctBrand);
            }
        });
    });

    return correctedQuery;
};

/**
 * Checks if two strings are fuzzy matches
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @param {number} threshold - Minimum similarity threshold
 * @returns {boolean}
 */
const isFuzzyMatch = (str1, str2, threshold = 0.75) => {
    const similarity = calculateSimilarity(str1, str2);
    return similarity >= threshold;
};

/**
 * Gets the best match from a list of candidates
 * @param {string} query - Search term
 * @param {Array<string>} candidates - List of possible matches
 * @returns {Object|null} - Best match with score
 */
const getBestMatch = (query, candidates) => {
    const matches = findFuzzyMatches(query, candidates, 0.5);
    return matches.length > 0 ? matches[0] : null;
};

module.exports = {
    calculateSimilarity,
    findFuzzyMatches,
    correctBrandTypos,
    isFuzzyMatch,
    getBestMatch,
    brandVariations
};
