# 🛒 E-Commerce Search Engine Microservice

> A production-ready search engine for electronics targeting Tier-2 and Tier-3 cities in India with intelligent Hinglish support and fuzzy matching.

## 🎯 Problem Statement

Build a scalable search microservice that understands:
- **Typos**: "Ifone" → iPhone
- **Hinglish**: "sasta mobile" → cheap phones
- **Budget queries**: "iphone 50k ke andar"
- **Attributes**: "red color phone", "8GB RAM laptop"
- **Intent**: Accessory vs Mobile detection

## 🏗️ Architecture

```
API Layer (Express Routes)
    ↓
Controllers (Request Handling)
    ↓
Services (Business Logic)
    ├── Intent Parser (Query Understanding)
    ├── Search Service (Product Filtering)
    └── Ranking Service (Result Scoring)
    ↓
MongoDB (Product Catalog)
```

## 📁 Project Structure

```
jumbotail/
├── src/
│   ├── models/
│   │   └── Product.js              # MongoDB schema
│   ├── controllers/
│   │   ├── productController.js    # Product CRUD operations
│   │   └── searchController.js     # Search endpoint
│   ├── routes/
│   │   ├── productRoutes.js        # Product API routes
│   │   └── searchRoutes.js         # Search API routes
│   ├── services/
│   │   ├── intentParser.js         # Query parsing & understanding
│   │   ├── searchService.js        # Product search logic
│   │   └── rankingService.js       # Scoring algorithm
│   ├── utils/
│   │   ├── fuzzyMatcher.js         # Typo correction
│   │   ├── hinglishMapper.js       # Hinglish translations
│   │   └── errorHandler.js         # Error middleware
│   ├── config/
│   │   └── database.js             # MongoDB connection
│   └── server.js                   # Express app entry point
├── scripts/
│   └── generateProducts.js         # Fake data generator
├── .env.example
├── package.json
├── README.md
└── llm_usage.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.x
- MongoDB >= 5.x (or use MongoDB Atlas)

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB URI

# Generate 1000 fake products
npm run generate-data

# Start development server
npm run dev

# Start production server
npm start
```

## 📡 API Endpoints

### 1. Create Product
```http
POST /api/v1/product
Content-Type: application/json

{
  "title": "iPhone 15 Pro",
  "description": "Latest Apple flagship with A17 chip",
  "price": 129900,
  "mrp": 139900,
  "rating": 4.5,
  "stock": 50,
  "sales": 1200,
  "metadata": {
    "ram": "8GB",
    "storage": "256GB",
    "color": "Titanium Blue",
    "screenSize": "6.1 inch",
    "brightness": "2000 nits",
    "model": "iPhone 15 Pro"
  }
}
```

### 2. Update Product Metadata
```http
PUT /api/v1/product/meta-data
Content-Type: application/json

{
  "id": "product_id_here",
  "metadata": {
    "ram": "12GB",
    "storage": "512GB"
  }
}
```

### 3. Search Products
```http
GET /api/v1/search/product?query=sasta iphone 50k

Response:
{
  "success": true,
  "query": "sasta iphone 50k",
  "parsedIntent": {
    "keywords": ["cheap", "iphone"],
    "budget": 50000,
    "attributes": {},
    "category": "mobile"
  },
  "results": [
    {
      "id": "...",
      "title": "iPhone 12",
      "price": 45999,
      "rating": 4.3,
      "score": 87.5,
      "matchReason": "Budget match, High rating"
    }
  ],
  "count": 15,
  "responseTime": "245ms"
}
```

## 🧠 Ranking Algorithm

### Formula
```
Final Score = (
  0.35 × Text Relevance +
  0.20 × Rating Score +
  0.15 × Price Score +
  0.15 × Stock Score +
  0.10 × Sales Score +
  0.05 × Metadata Match
) × 100
```

### Components Explained

1. **Text Relevance (35% weight)**
   - Exact match: 1.0
   - Fuzzy match: 0.7-0.9
   - Partial match: 0.4-0.6
   - No match: 0.0

2. **Rating Score (20% weight)**
   - Formula: `rating / 5`
   - 5-star product = 1.0
   - 3-star product = 0.6

3. **Price Score (15% weight)**
   - Within budget: 1.0
   - 10% over budget: 0.7
   - 20% over budget: 0.4
   - More than 20% over: 0.1

4. **Stock Score (15% weight)**
   - In stock: 1.0
   - Out of stock: 0.3 (still show but penalize)

5. **Sales Score (10% weight)**
   - Normalized: `sales / maxSales`
   - Popular products get boost

6. **Metadata Match (5% weight)**
   - Each matching attribute: +0.2
   - Max score: 1.0

### Example Calculation

```javascript
Product: iPhone 13 (128GB, Blue)
Query: "blue iphone 60k"

Text Relevance: 0.9 (exact brand match, color match)
Rating: 4.5/5 = 0.9
Price: ₹59,999 (within ₹60k) = 1.0
Stock: Available = 1.0
Sales: 500 (normalized) = 0.7
Metadata: color match = 0.2

Score = (0.35×0.9 + 0.20×0.9 + 0.15×1.0 + 0.15×1.0 + 0.10×0.7 + 0.05×0.2) × 100
      = (0.315 + 0.18 + 0.15 + 0.15 + 0.07 + 0.01) × 100
      = 87.5
```

## 🌐 Hinglish Support

### Supported Mappings
```javascript
{
  "sasta": "cheap",
  "mehenga": "expensive",
  "accha": "good",
  "best": "best",
  "naya": "new",
  "purana": "old",
  "bada": "large",
  "chota": "small"
}
```

### Example Queries
- "sasta mobile" → Search for cheap phones
- "accha camera wala phone" → Good camera phones
- "bada screen laptop" → Large screen laptops

## 🎯 Features

✅ Fuzzy matching for typos (Levenshtein distance)  
✅ Hinglish intent detection  
✅ Budget extraction from queries  
✅ Attribute-based filtering  
✅ Category detection (mobile vs accessory)  
✅ Weighted ranking algorithm  
✅ Sub-1000ms response time  
✅ Error handling & validation  
✅ 1000+ fake products for testing  

## 🧪 Testing

```bash
# Test product creation
curl -X POST http://localhost:5000/api/v1/product \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Phone","price":25000,...}'

# Test search
curl "http://localhost:5000/api/v1/search/product?query=iphone%2050k"

# Test Hinglish
curl "http://localhost:5000/api/v1/search/product?query=sasta%20mobile"

# Test fuzzy matching
curl "http://localhost:5000/api/v1/search/product?query=ifone"
```

## 📊 Performance

- **Target Response Time**: < 1000ms
- **Optimization Techniques**:
  - MongoDB indexing on title, price, rating
  - In-memory caching for frequent queries
  - Efficient regex patterns
  - Limit result set to top 50

## 🔧 Configuration

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jumbotail
NODE_ENV=development
MAX_RESULTS=50
CACHE_TTL=300
```

## 🚨 Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

## 📝 Interview Notes

### Key Design Decisions

1. **Why weighted scoring?**
   - Different signals have different importance
   - Text relevance most important (35%)
   - Rating builds trust (20%)
   - Price crucial for budget-conscious users (15%)

2. **Why Hinglish support?**
   - Tier-2/3 cities prefer native language
   - Increases accessibility
   - Better user experience

3. **Why fuzzy matching?**
   - Mobile keyboards prone to typos
   - Improves search recall
   - Better UX for non-English speakers

4. **Scalability considerations**:
   - MongoDB indexing for fast queries
   - Stateless design for horizontal scaling
   - Caching layer for popular queries
   - Async operations where possible

## 📚 Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Utilities**: 
  - `fast-levenshtein` - Fuzzy matching
  - `dotenv` - Environment config
  - `express-validator` - Input validation

## 👨‍💻 Author

Built as an interview assignment demonstrating:
- Clean architecture
- Scalable design patterns
- Real-world problem solving
- Production-ready code quality

## 📄 License

MIT
