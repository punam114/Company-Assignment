const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductMetadata,
    updateProduct,
    deleteProduct,
    getProductStats,
    searchProductsController,
    searchByCategoryController
} = require('../controllers/productController');

// Search Routes
router.get('/product', searchProductsController);
router.get('/category/:category', searchByCategoryController);

// CRUD Routes
router.post('/add', createProduct);
router.get('/list', getAllProducts);
router.get('/stats', getProductStats);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.patch('/metadata', updateProductMetadata);
router.delete('/:id', deleteProduct);

module.exports = router;