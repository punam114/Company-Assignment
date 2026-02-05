const express = require('express');
const router = express.Router();
const {
    searchProductsController,
    searchByCategoryController
} = require('../controllers/productController');

router.get('/product', searchProductsController);
router.get('/category/:category', searchByCategoryController);

module.exports = router;