const Product = require('../models/Product');
const { parseIntent } = require('./intentParser');
const { rankProducts, generateMatchReason } = require('./rankingService');

/**
 * Search Service
 * Handles product search with intelligent filtering and ranking
 */

/**
 * Builds MongoDB query from parsed intent
 * @param {Object} intent - Parsed search intent
 * @returns {Object} - MongoDB query object
 */
const buildSearchQuery = (intent) => {
    const query = {};

    // Text search using keywords
    if (intent.keywords && intent.keywords.length > 0) {
        // Create regex patterns for each keyword
        const keywordRegex = intent.keywords.map(keyword => new RegExp(keyword, 'i'));

        query.$or = [
            { title: { $in: keywordRegex } },
            { description: { $in: keywordRegex } },
            { 'metadata.brand': { $in: keywordRegex } },
            { 'metadata.model': { $in: keywordRegex } }
        ];
    }

    // Budget filter
    if (intent.budget) {
        // Allow 20% over budget for better results
        query.price = { $lte: intent.budget * 1.2 };
    }

    // Category filter
    if (intent.category) {
        query['metadata.category'] = new RegExp(intent.category, 'i');
    }

    // Attribute filters
    if (intent.attributes && Object.keys(intent.attributes).length > 0) {
        Object.keys(intent.attributes).forEach(attr => {
            const value = intent.attributes[attr];
            query[`metadata.${attr}`] = new RegExp(value, 'i');
        });
    }

    return query;
};

/**
 * Searches products based on query
 * @param {string} queryString - User's search query
 * @param {Object} options - Search options (limit, skip, etc.)
 * @returns {Object} - Search results with metadata
 */
const searchProducts = async (queryString, options = {}) => {
    const startTime = Date.now();

    try {
        // Step 1: Parse user intent
        const intent = parseIntent(queryString);

        // Step 2: Build MongoDB query
        const searchQuery = buildSearchQuery(intent);

        // Step 3: Execute search
        const limit = options.limit || parseInt(process.env.MAX_RESULTS) || 50;
        const skip = options.skip || 0;

        let products;

        // If no specific filters, get all products for ranking
        if (Object.keys(searchQuery).length === 0) {
            products = await Product.find()
                .limit(limit * 2) // Get more for better ranking
                .lean();
        } else {
            products = await Product.find(searchQuery)
                .limit(limit * 2) // Get more for better ranking
                .lean();
        }

        // Step 4: Rank products using weighted algorithm
        const rankedProducts = rankProducts(products, intent);

        // Step 5: Add match reasons
        const resultsWithReasons = rankedProducts.map(product => ({
            id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            mrp: product.mrp,
            rating: product.rating,
            stock: product.stock,
            sales: product.sales,
            metadata: product.metadata,
            score: product.score,
            matchReason: generateMatchReason(product, intent)
        }));

        // Step 6: Apply pagination
        const paginatedResults = resultsWithReasons.slice(skip, skip + limit);

        // Step 7: Calculate response time
        const responseTime = Date.now() - startTime;

        return {
            success: true,
            query: queryString,
            parsedIntent: intent,
            results: paginatedResults,
            count: paginatedResults.length,
            totalMatches: rankedProducts.length,
            responseTime: `${responseTime}ms`
        };

    } catch (error) {
        throw error;
    }
};

/**
 * Searches products by category
 * @param {string} category - Product category
 * @param {Object} options - Search options
 * @returns {Array} - Products in category
 */
const searchByCategory = async (category, options = {}) => {
    const limit = options.limit || 50;
    const skip = options.skip || 0;

    const products = await Product.find({
        'metadata.category': new RegExp(category, 'i')
    })
        .sort({ rating: -1, sales: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    return products;
};

/**
 * Searches products by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {Object} options - Search options
 * @returns {Array} - Products in price range
 */
const searchByPriceRange = async (minPrice, maxPrice, options = {}) => {
    const limit = options.limit || 50;
    const skip = options.skip || 0;

    const products = await Product.find({
        price: { $gte: minPrice, $lte: maxPrice }
    })
        .sort({ rating: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    return products;
};

/**
 * Gets trending products (high sales, good rating)
 * @param {Object} options - Search options
 * @returns {Array} - Trending products
 */
const getTrendingProducts = async (options = {}) => {
    const limit = options.limit || 20;

    const products = await Product.find({
        rating: { $gte: 4.0 },
        stock: { $gt: 0 }
    })
        .sort({ sales: -1, rating: -1 })
        .limit(limit)
        .lean();

    return products;
};

module.exports = {
    searchProducts,
    searchByCategory,
    searchByPriceRange,
    getTrendingProducts
};
