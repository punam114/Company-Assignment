const { searchProducts, searchByCategory, searchByPriceRange, getTrendingProducts } = require('../services/searchService');
const { ApiError } = require('../utils/errorHandler');

/**
 * Search Controller
 * Handles search-related endpoints
 */

/**
 * @desc    Search products with intelligent ranking
 * @route   GET /api/v1/search/product?query=
 * @access  Public
 */
const searchProductsController = async (req, res, next) => {
    try {
        const { query, page, limit } = req.query;

        if (!query) {
            throw new ApiError(400, 'Please provide a search query', 'MISSING_QUERY');
        }

        const options = {
            skip: page ? (parseInt(page) - 1) * (parseInt(limit) || 50) : 0,
            limit: limit ? parseInt(limit) : 50
        };

        const results = await searchProducts(query, options);

        res.status(200).json(results);

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Search products by category
 * @route   GET /api/v1/search/category/:category
 * @access  Public
 */
const searchByCategoryController = async (req, res, next) => {
    try {
        const { category } = req.params;
        const { page, limit } = req.query;

        const options = {
            skip: page ? (parseInt(page) - 1) * (parseInt(limit) || 50) : 0,
            limit: limit ? parseInt(limit) : 50
        };

        const products = await searchByCategory(category, options);

        res.status(200).json({
            success: true,
            category,
            count: products.length,
            data: products
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Search products by price range
 * @route   GET /api/v1/search/price?min=&max=
 * @access  Public
 */
const searchByPriceController = async (req, res, next) => {
    try {
        const { min, max, page, limit } = req.query;

        if (!min || !max) {
            throw new ApiError(400, 'Please provide min and max price', 'MISSING_PARAMS');
        }

        const options = {
            skip: page ? (parseInt(page) - 1) * (parseInt(limit) || 50) : 0,
            limit: limit ? parseInt(limit) : 50
        };

        const products = await searchByPriceRange(parseInt(min), parseInt(max), options);

        res.status(200).json({
            success: true,
            priceRange: { min: parseInt(min), max: parseInt(max) },
            count: products.length,
            data: products
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get trending products
 * @route   GET /api/v1/search/trending
 * @access  Public
 */
const getTrendingController = async (req, res, next) => {
    try {
        const { limit } = req.query;

        const options = {
            limit: limit ? parseInt(limit) : 20
        };

        const products = await getTrendingProducts(options);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchProductsController,
    searchByCategoryController,
    searchByPriceController,
    getTrendingController
};
