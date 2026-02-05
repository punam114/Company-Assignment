const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductMetadata,
    updateProduct,
    deleteProduct,
    getProductStats
} = require('../controllers/productController');

/**
 * Product Routes
 */

// GET /api/v1/product/stats - Get product statistics
router.get('/stats', getProductStats);

// POST /api/v1/product - Create new product
router.post('/', createProduct);

// GET /api/v1/product - Get all products
router.get('/', getAllProducts);

// GET /api/v1/product/:id - Get single product
router.get('/:id', getProductById);

// PUT /api/v1/product/meta-data - Update product metadata
router.put('/meta-data', updateProductMetadata);

// PUT /api/v1/product/:id - Update product
router.put('/:id', updateProduct);

// DELETE /api/v1/product/:id - Delete product
router.delete('/:id', deleteProduct);

module.exports = router;
