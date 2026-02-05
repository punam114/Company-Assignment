# 📁 Project Structure

```
Jumbotail/
│
├── 📄 README.md                    # Main documentation
├── 📄 ARCHITECTURE.md              # System architecture details
├── 📄 TESTING.md                   # Testing guide
├── 📄 llm_usage.md                 # LLM usage documentation
├── 📄 package.json                 # Dependencies and scripts
├── 📄 .env                         # Environment variables
├── 📄 .env.example                 # Environment template
├── 📄 .gitignore                   # Git ignore rules
│
├── 📂 src/                         # Source code
│   │
│   ├── 📄 server.js                # Express app entry point
│   │
│   ├── 📂 config/                  # Configuration files
│   │   └── 📄 database.js          # MongoDB connection
│   │
│   ├── 📂 models/                  # Database models
│   │   └── 📄 Product.js           # Product schema
│   │
│   ├── 📂 controllers/             # Request handlers
│   │   ├── 📄 productController.js # Product CRUD
│   │   └── 📄 searchController.js  # Search endpoints
│   │
│   ├── 📂 routes/                  # API routes
│   │   ├── 📄 productRoutes.js     # Product routes
│   │   └── 📄 searchRoutes.js      # Search routes
│   │
│   ├── 📂 services/                # Business logic
│   │   ├── 📄 intentParser.js      # Query understanding
│   │   ├── 📄 searchService.js     # Product search
│   │   └── 📄 rankingService.js    # Scoring algorithm
│   │
│   └── 📂 utils/                   # Utility functions
│       ├── 📄 fuzzyMatcher.js      # Typo correction
│       ├── 📄 hinglishMapper.js    # Hinglish translation
│       └── 📄 errorHandler.js      # Error handling
│
└── 📂 scripts/                     # Utility scripts
    └── 📄 generateProducts.js      # Fake data generator
```

---

## File Descriptions

### Root Level

| File | Purpose | Lines |
|------|---------|-------|
| `README.md` | Main documentation, setup guide, API docs | ~300 |
| `ARCHITECTURE.md` | System design, data flow, algorithms | ~500 |
| `TESTING.md` | Test cases, curl commands, validation | ~250 |
| `llm_usage.md` | LLM contribution tracking | ~200 |
| `package.json` | NPM dependencies and scripts | ~40 |
| `.env` | Environment configuration | ~5 |

---

### src/config/

**Purpose:** Configuration and initialization

| File | Responsibility |
|------|---------------|
| `database.js` | MongoDB connection setup |

---

### src/models/

**Purpose:** Database schemas and models

| File | Schema | Indexes |
|------|--------|---------|
| `Product.js` | Product schema with metadata | title, price, rating, text |

**Schema Fields:**
- `title` - Product name
- `description` - Product details
- `price` - Current price
- `mrp` - Maximum retail price
- `rating` - User rating (0-5)
- `stock` - Available quantity
- `sales` - Total sales count
- `metadata` - Dynamic attributes (RAM, storage, color, etc.)

---

### src/controllers/

**Purpose:** Handle HTTP requests and responses

| File | Endpoints | Methods |
|------|-----------|---------|
| `productController.js` | `/api/v1/product` | GET, POST, PUT, DELETE |
| `searchController.js` | `/api/v1/search` | GET |

**Responsibilities:**
- Request validation
- Call service layer
- Format responses
- Error handling

---

### src/routes/

**Purpose:** Define API endpoints

| File | Routes |
|------|--------|
| `productRoutes.js` | Product CRUD routes |
| `searchRoutes.js` | Search-related routes |

**Route Structure:**
```
/api/v1/
  ├── product/
  │   ├── POST /              (Create)
  │   ├── GET /               (List all)
  │   ├── GET /:id            (Get one)
  │   ├── PUT /meta-data      (Update metadata)
  │   ├── PUT /:id            (Update)
  │   └── DELETE /:id         (Delete)
  │
  └── search/
      ├── GET /product        (Main search)
      ├── GET /category/:cat  (By category)
      ├── GET /price          (Price range)
      └── GET /trending       (Trending)
```

---

### src/services/

**Purpose:** Core business logic

| File | Responsibility | Key Functions |
|------|---------------|---------------|
| `intentParser.js` | Understand user queries | `parseIntent()` |
| `searchService.js` | Find products | `searchProducts()` |
| `rankingService.js` | Score and rank | `rankProducts()` |

**Service Flow:**
```
Query → Intent Parser → Search Service → Ranking Service → Results
```

---

### src/utils/

**Purpose:** Helper functions and utilities

| File | Purpose | Algorithm |
|------|---------|-----------|
| `fuzzyMatcher.js` | Typo correction | Levenshtein Distance |
| `hinglishMapper.js` | Language translation | Dictionary mapping |
| `errorHandler.js` | Error management | Custom error classes |

---

### scripts/

**Purpose:** Utility scripts for setup and maintenance

| File | Purpose | Output |
|------|---------|--------|
| `generateProducts.js` | Generate fake data | 1000 products |

**Generated Data:**
- 500 mobiles
- 300 laptops
- 200 accessories

---

## Code Statistics

### Total Lines of Code

| Category | Files | Lines | Percentage |
|----------|-------|-------|------------|
| Services | 3 | ~600 | 35% |
| Controllers | 2 | ~200 | 12% |
| Models | 1 | ~80 | 5% |
| Routes | 2 | ~60 | 3% |
| Utils | 3 | ~400 | 23% |
| Config | 1 | ~20 | 1% |
| Scripts | 1 | ~250 | 15% |
| Server | 1 | ~80 | 5% |
| **Total** | **14** | **~1690** | **100%** |

---

## Dependencies

### Production Dependencies

```json
{
  "express": "^4.18.2",        // Web framework
  "mongoose": "^8.0.3",        // MongoDB ODM
  "dotenv": "^16.3.1",         // Environment variables
  "cors": "^2.8.5",            // Cross-origin support
  "fast-levenshtein": "^3.0.0", // Fuzzy matching
  "express-validator": "^7.0.1" // Input validation
}
```

### Development Dependencies

```json
{
  "nodemon": "^3.0.2"          // Auto-restart server
}
```

---

## NPM Scripts

```json
{
  "start": "node src/server.js",           // Production
  "dev": "nodemon src/server.js",          // Development
  "generate-data": "node scripts/generateProducts.js"  // Data generation
}
```

---

## Environment Variables

```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/jumbotail  # Database URI
NODE_ENV=development                         # Environment
MAX_RESULTS=50                               # Max search results
CACHE_TTL=300                                # Cache duration (seconds)
```

---

## API Endpoints Summary

### Product Endpoints (7)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/product` | Create product |
| GET | `/api/v1/product` | List products |
| GET | `/api/v1/product/:id` | Get product |
| PUT | `/api/v1/product/meta-data` | Update metadata |
| PUT | `/api/v1/product/:id` | Update product |
| DELETE | `/api/v1/product/:id` | Delete product |
| GET | `/api/v1/product/stats` | Get statistics |

### Search Endpoints (4)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/search/product` | Main search |
| GET | `/api/v1/search/category/:cat` | Category search |
| GET | `/api/v1/search/price` | Price range |
| GET | `/api/v1/search/trending` | Trending products |

---

## Key Features by File

### intentParser.js
- ✅ Hinglish translation
- ✅ Budget extraction (50k, 5 lakh, etc.)
- ✅ Attribute parsing (RAM, storage, color)
- ✅ Category detection
- ✅ Keyword extraction

### rankingService.js
- ✅ Weighted scoring (6 signals)
- ✅ Text relevance calculation
- ✅ Price scoring with budget
- ✅ Stock availability handling
- ✅ Match reason generation

### searchService.js
- ✅ MongoDB query building
- ✅ Result ranking
- ✅ Pagination
- ✅ Response time tracking

### fuzzyMatcher.js
- ✅ Levenshtein distance
- ✅ Brand typo correction
- ✅ Similarity scoring
- ✅ Best match selection

### hinglishMapper.js
- ✅ 30+ word mappings
- ✅ Translation function
- ✅ Hinglish detection

---

## Design Patterns Used

1. **MVC Pattern**
   - Models: Database schemas
   - Views: JSON responses
   - Controllers: Request handlers

2. **Service Layer Pattern**
   - Business logic separated from controllers
   - Reusable service functions

3. **Repository Pattern**
   - Mongoose models abstract database access

4. **Middleware Pattern**
   - Error handling
   - Request parsing
   - CORS

5. **Factory Pattern**
   - Product generation in scripts

---

## Performance Characteristics

| Metric | Target | Typical |
|--------|--------|---------|
| Response Time | < 1000ms | 200-500ms |
| Database Queries | 1-2 per request | 1 |
| Memory Usage | < 100MB | ~50MB |
| Concurrent Users | 100+ | N/A |

---

## Future Enhancements

### Planned Features
- [ ] Redis caching
- [ ] Elasticsearch integration
- [ ] User authentication
- [ ] Product recommendations
- [ ] Analytics dashboard
- [ ] Image search
- [ ] Voice search (Hinglish)

### Scalability Improvements
- [ ] Database sharding
- [ ] Read replicas
- [ ] Load balancing
- [ ] CDN integration
- [ ] Microservices split

---

This structure is designed for:
- ✅ **Clarity**: Easy to understand
- ✅ **Maintainability**: Clean separation
- ✅ **Scalability**: Ready to grow
- ✅ **Testability**: Easy to test
- ✅ **Interview-ready**: Professional structure
