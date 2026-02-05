const Product = require('../models/Product');
const { parseIntent } = require('./intentParser');
const { calculateScore } = require('./rankingService');

const searchProducts = async (query, options = {}) => {
    const startTime = Date.now();

    const parsedIntent = parseIntent(query);

    let filter = {};

    if (parsedIntent.budget) {
        filter.price = { $lte: parsedIntent.budget };
    }

    if (parsedIntent.attributes.color) {
        filter['metadata.color'] = new RegExp(parsedIntent.attributes.color, 'i');
    }

    const products = await Product.find(filter)
        .skip(options.skip || 0)
        .limit(options.limit || 50);

    const scoredProducts = products.map(product => {
        const score = calculateScore(product, parsedIntent);
        return {
            ...product.toObject(),
            score: Math.round(score * 100) / 100
        };
    }).sort((a, b) => b.score - a.score);

    const responseTime = `${Date.now() - startTime}ms`;

    return {
        success: true,
        query,
        parsedIntent,
        results: scoredProducts,
        count: scoredProducts.length,
        responseTime
    };
};

const searchByCategory = async (category, options = {}) => {
    return await Product.find({ 'metadata.category': new RegExp(category, 'i') })
        .skip(options.skip || 0)
        .limit(options.limit || 50);
};

module.exports = {
    searchProducts,
    searchByCategory
};