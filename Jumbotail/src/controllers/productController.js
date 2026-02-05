const { searchProducts, searchByCategory, searchByPriceRange, getTrendingProducts } = require('../services/searchService');
const { ApiError } = require('../middlewares/errorHandler');

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

module.exports = {
    searchProductsController,
    searchByCategoryController
};