const express = require('express');
const router = express.Router();
const {
    searchProductsController,
    searchByCategoryController,
    searchByPriceController,
    getTrendingController
} = require('../controllers/searchController');

/**
 * Search Routes
 */

// GET /api/v1/search/product?query= - Main search endpoint
router.get('/product', searchProductsController);

// GET /api/v1/search/category/:category - Search by category
router.get('/category/:category', searchByCategoryController);

// GET /api/v1/search/price?min=&max= - Search by price range
router.get('/price', searchByPriceController);

// GET /api/v1/search/trending - Get trending products
router.get('/trending', getTrendingController);

module.exports = router;
