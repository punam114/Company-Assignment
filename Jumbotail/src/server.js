require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./utils/errorHandler');

// Import routes
const productRoutes = require('./routes/productRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/search', searchRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Jumbotail Search Engine API',
        version: '1.0.0',
        endpoints: {
            products: {
                create: 'POST /api/v1/product',
                getAll: 'GET /api/v1/product',
                getById: 'GET /api/v1/product/:id',
                updateMetadata: 'PUT /api/v1/product/meta-data',
                update: 'PUT /api/v1/product/:id',
                delete: 'DELETE /api/v1/product/:id',
                stats: 'GET /api/v1/product/stats'
            },
            search: {
                main: 'GET /api/v1/search/product?query=',
                category: 'GET /api/v1/search/category/:category',
                priceRange: 'GET /api/v1/search/price?min=&max=',
                trending: 'GET /api/v1/search/trending'
            }
        },
        examples: {
            search: [
                '/api/v1/search/product?query=iphone',
                '/api/v1/search/product?query=sasta mobile',
                '/api/v1/search/product?query=iphone 50k',
                '/api/v1/search/product?query=red color phone',
                '/api/v1/search/product?query=8gb ram laptop'
            ]
        }
    });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/\n`);
});

module.exports = app;
