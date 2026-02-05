/**
 * Ranking Service
 * Implements weighted scoring algorithm to rank search results
 * 
 * Formula:
 * Final Score = (
 *   0.35 × Text Relevance +
 *   0.20 × Rating Score +
 *   0.15 × Price Score +
 *   0.15 × Stock Score +
 *   0.10 × Sales Score +
 *   0.05 × Metadata Match
 * ) × 100
 */

const { calculateSimilarity } = require('../utils/fuzzyMatcher');

// Weights for different ranking signals
const WEIGHTS = {
    TEXT_RELEVANCE: 0.35,  // Most important - does it match what user searched?
    RATING: 0.20,          // Quality indicator
    PRICE: 0.15,           // Budget consideration
    STOCK: 0.15,           // Availability
    SALES: 0.10,           // Popularity
    METADATA: 0.05         // Attribute match
};

/**
 * Calculates text relevance score
 * Checks how well product title/description matches search keywords
 * @param {Object} product - Product object
 * @param {Array<string>} keywords - Search keywords
 * @returns {number} - Score between 0 and 1
 */
const calculateTextRelevance = (product, keywords) => {
    if (!keywords || keywords.length === 0) return 0;

    const title = (product.title || '').toLowerCase();
    const description = (product.description || '').toLowerCase();
    const combinedText = `${title} ${description}`;

    let totalScore = 0;
    let matchedKeywords = 0;

    keywords.forEach(keyword => {
        // Exact match in title (highest score)
        if (title.includes(keyword)) {
            totalScore += 1.0;
            matchedKeywords++;
        }
        // Exact match in description (medium score)
        else if (description.includes(keyword)) {
            totalScore += 0.7;
            matchedKeywords++;
        }
        // Fuzzy match (lower score)
        else {
            const words = combinedText.split(' ');
            const bestMatch = words.reduce((best, word) => {
                const similarity = calculateSimilarity(keyword, word);
                return similarity > best ? similarity : best;
            }, 0);

            if (bestMatch > 0.75) {
                totalScore += bestMatch * 0.8;
                matchedKeywords++;
            }
        }
    });

    // Average score across all keywords
    return matchedKeywords > 0 ? totalScore / keywords.length : 0;
};

/**
 * Calculates rating score
 * Normalizes product rating to 0-1 scale
 * @param {Object} product - Product object
 * @returns {number} - Score between 0 and 1
 */
const calculateRatingScore = (product) => {
    const rating = product.rating || 0;
    return rating / 5; // Normalize to 0-1 (assuming max rating is 5)
};

/**
 * Calculates price score based on budget
 * Products within budget get higher scores
 * @param {Object} product - Product object
 * @param {number|null} budget - User's budget
 * @returns {number} - Score between 0 and 1
 */
const calculatePriceScore = (product, budget) => {
    const price = product.price || 0;

    // If no budget specified, prefer lower prices
    if (!budget) {
        // Assuming max price is 200000 for normalization
        return 1 - (price / 200000);
    }

    // Within budget - perfect score
    if (price <= budget) {
        return 1.0;
    }

    // Calculate how much over budget
    const overBudgetPercent = ((price - budget) / budget) * 100;

    // 10% over budget - 0.7 score
    if (overBudgetPercent <= 10) {
        return 0.7;
    }

    // 20% over budget - 0.4 score
    if (overBudgetPercent <= 20) {
        return 0.4;
    }

    // More than 20% over budget - low score
    return 0.1;
};

/**
 * Calculates stock availability score
 * In-stock products get higher scores
 * @param {Object} product - Product object
 * @returns {number} - Score between 0 and 1
 */
const calculateStockScore = (product) => {
    const stock = product.stock || 0;

    if (stock > 0) {
        return 1.0; // In stock - perfect score
    }

    return 0.3; // Out of stock - still show but penalize
};

/**
 * Calculates sales popularity score
 * More popular products get higher scores
 * @param {Object} product - Product object
 * @param {number} maxSales - Maximum sales in the result set
 * @returns {number} - Score between 0 and 1
 */
const calculateSalesScore = (product, maxSales) => {
    const sales = product.sales || 0;

    if (maxSales === 0) return 0;

    // Normalize sales to 0-1 scale
    return sales / maxSales;
};

/**
 * Calculates metadata match score
 * Checks how many requested attributes match
 * @param {Object} product - Product object
 * @param {Object} requestedAttributes - Attributes from search query
 * @returns {number} - Score between 0 and 1
 */
const calculateMetadataScore = (product, requestedAttributes) => {
    if (!requestedAttributes || Object.keys(requestedAttributes).length === 0) {
        return 0;
    }

    const productMetadata = product.metadata || {};
    let matchCount = 0;
    let totalAttributes = Object.keys(requestedAttributes).length;

    Object.keys(requestedAttributes).forEach(attr => {
        const requestedValue = requestedAttributes[attr].toLowerCase();
        const productValue = (productMetadata[attr] || '').toLowerCase();

        // Exact match
        if (productValue.includes(requestedValue)) {
            matchCount++;
        }
        // Fuzzy match
        else if (calculateSimilarity(requestedValue, productValue) > 0.8) {
            matchCount += 0.8;
        }
    });

    return matchCount / totalAttributes;
};

/**
 * Main ranking function
 * Calculates final weighted score for a product
 * @param {Object} product - Product object
 * @param {Object} intent - Parsed search intent
 * @param {number} maxSales - Maximum sales in result set
 * @returns {number} - Final score (0-100)
 */
const calculateProductScore = (product, intent, maxSales = 1000) => {
    const textRelevance = calculateTextRelevance(product, intent.keywords);
    const ratingScore = calculateRatingScore(product);
    const priceScore = calculatePriceScore(product, intent.budget);
    const stockScore = calculateStockScore(product);
    const salesScore = calculateSalesScore(product, maxSales);
    const metadataScore = calculateMetadataScore(product, intent.attributes);

    // Calculate weighted final score
    const finalScore = (
        WEIGHTS.TEXT_RELEVANCE * textRelevance +
        WEIGHTS.RATING * ratingScore +
        WEIGHTS.PRICE * priceScore +
        WEIGHTS.STOCK * stockScore +
        WEIGHTS.SALES * salesScore +
        WEIGHTS.METADATA * metadataScore
    ) * 100;

    return Math.round(finalScore * 10) / 10; // Round to 1 decimal place
};

/**
 * Ranks an array of products
 * @param {Array} products - Array of product objects
 * @param {Object} intent - Parsed search intent
 * @returns {Array} - Sorted array with scores
 */
const rankProducts = (products, intent) => {
    if (!products || products.length === 0) return [];

    // Find max sales for normalization
    const maxSales = Math.max(...products.map(p => p.sales || 0));

    // Calculate score for each product
    const scoredProducts = products.map(product => ({
        ...product.toObject ? product.toObject() : product,
        score: calculateProductScore(product, intent, maxSales)
    }));

    // Sort by score (highest first)
    scoredProducts.sort((a, b) => b.score - a.score);

    return scoredProducts;
};

/**
 * Generates match reason for a product
 * Explains why this product was ranked high
 * @param {Object} product - Product with score
 * @param {Object} intent - Parsed search intent
 * @returns {string} - Human-readable match reason
 */
const generateMatchReason = (product, intent) => {
    const reasons = [];

    // Check budget match
    if (intent.budget && product.price <= intent.budget) {
        reasons.push('Within budget');
    }

    // Check rating
    if (product.rating >= 4.0) {
        reasons.push('High rating');
    }

    // Check stock
    if (product.stock > 0) {
        reasons.push('In stock');
    }

    // Check popularity
    if (product.sales > 500) {
        reasons.push('Popular choice');
    }

    // Check metadata matches
    if (intent.attributes && Object.keys(intent.attributes).length > 0) {
        const matches = Object.keys(intent.attributes).filter(attr => {
            const requestedValue = intent.attributes[attr].toLowerCase();
            const productValue = ((product.metadata || {})[attr] || '').toLowerCase();
            return productValue.includes(requestedValue);
        });

        if (matches.length > 0) {
            reasons.push(`Matches ${matches.join(', ')}`);
        }
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Relevant match';
};

module.exports = {
    calculateProductScore,
    rankProducts,
    generateMatchReason,
    WEIGHTS
};
