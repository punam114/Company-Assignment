const Product = require('../models/Product');
const { ApiError } = require('../utils/errorHandler');

/**
 * Product Controller
 * Handles CRUD operations for products
 */

/**
 * @desc    Create new product
 * @route   POST /api/v1/product
 * @access  Public (should be protected in production)
 */
const createProduct = async (req, res, next) => {
    try {
        const {
            title,
            description,
            price,
            mrp,
            rating,
            stock,
            sales,
            metadata
        } = req.body;

        // Validation
        if (!title || !description || !price || !mrp) {
            throw new ApiError(400, 'Please provide all required fields', 'MISSING_FIELDS');
        }

        // Create product
        const product = await Product.create({
            title,
            description,
            price,
            mrp,
            rating: rating || 0,
            stock: stock || 0,
            sales: sales || 0,
            metadata: metadata || {}
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all products
 * @route   GET /api/v1/product
 * @access  Public
 */
const getAllProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments();

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: products
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/v1/product/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            throw new ApiError(404, 'Product not found', 'NOT_FOUND');
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update product metadata
 * @route   PUT /api/v1/product/meta-data
 * @access  Public (should be protected in production)
 */
const updateProductMetadata = async (req, res, next) => {
    try {
        const { id, metadata } = req.body;

        if (!id || !metadata) {
            throw new ApiError(400, 'Please provide product ID and metadata', 'MISSING_FIELDS');
        }

        const product = await Product.findById(id);

        if (!product) {
            throw new ApiError(404, 'Product not found', 'NOT_FOUND');
        }

        // Merge existing metadata with new metadata
        product.metadata = {
            ...product.metadata,
            ...metadata
        };

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product metadata updated successfully',
            data: product
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update entire product
 * @route   PUT /api/v1/product/:id
 * @access  Public (should be protected in production)
 */
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            throw new ApiError(404, 'Product not found', 'NOT_FOUND');
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/v1/product/:id
 * @access  Public (should be protected in production)
 */
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            throw new ApiError(404, 'Product not found', 'NOT_FOUND');
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get product statistics
 * @route   GET /api/v1/product/stats
 * @access  Public
 */
const getProductStats = async (req, res, next) => {
    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    avgRating: { $avg: '$rating' },
                    totalSales: { $sum: '$sales' },
                    inStockCount: {
                        $sum: { $cond: [{ $gt: ['$stock', 0] }, 1, 0] }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats[0] || {}
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductMetadata,
    updateProduct,
    deleteProduct,
    getProductStats
};
