# 🏗️ System Architecture Documentation

## Table of Contents
1. [High-Level Architecture](#high-level-architecture)
2. [Component Details](#component-details)
3. [Data Flow](#data-flow)
4. [Ranking Algorithm Deep Dive](#ranking-algorithm-deep-dive)
5. [Intent Parser Deep Dive](#intent-parser-deep-dive)
6. [Performance Optimization](#performance-optimization)
7. [Scalability Considerations](#scalability-considerations)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│              (Web/Mobile App, API Consumers)                 │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                             │
│                   (Express.js Server)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   CORS       │  │  Body Parser │  │  Error       │      │
│  │  Middleware  │  │  Middleware  │  │  Handler     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│   Product    │          │    Search    │
│  Controller  │          │  Controller  │
└──────┬───────┘          └──────┬───────┘
       │                         │
       │                         │
       ▼                         ▼
┌──────────────┐          ┌──────────────────────────────┐
│   Product    │          │    Intent Parser Service     │
│   Service    │          │  (Hinglish + Fuzzy + Budget) │
└──────┬───────┘          └──────┬───────────────────────┘
       │                         │
       │                         ▼
       │                  ┌──────────────┐
       │                  │    Search    │
       │                  │   Service    │
       │                  └──────┬───────┘
       │                         │
       │                         ▼
       │                  ┌──────────────┐
       │                  │   Ranking    │
       │                  │   Service    │
       │                  └──────┬───────┘
       │                         │
       └─────────┬───────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│                  MongoDB Database                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Products Collection (Indexed on title, price, rating)│  │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. **API Gateway (Express Server)**

**Responsibility:** Entry point for all requests

**Key Features:**
- CORS handling for cross-origin requests
- Request parsing (JSON, URL-encoded)
- Error handling middleware
- Request logging (development mode)
- Health check endpoint

**File:** `src/server.js`

---

### 2. **Controllers**

#### Product Controller
**Responsibility:** Handle product CRUD operations

**Endpoints:**
- `POST /api/v1/product` - Create product
- `GET /api/v1/product` - Get all products (paginated)
- `GET /api/v1/product/:id` - Get single product
- `PUT /api/v1/product/meta-data` - Update metadata
- `PUT /api/v1/product/:id` - Update product
- `DELETE /api/v1/product/:id` - Delete product
- `GET /api/v1/product/stats` - Get statistics

**File:** `src/controllers/productController.js`

#### Search Controller
**Responsibility:** Handle search requests

**Endpoints:**
- `GET /api/v1/search/product?query=` - Main search
- `GET /api/v1/search/category/:category` - Category search
- `GET /api/v1/search/price?min=&max=` - Price range search
- `GET /api/v1/search/trending` - Trending products

**File:** `src/controllers/searchController.js`

---

### 3. **Services (Business Logic)**

#### Intent Parser Service
**Responsibility:** Understand user's search intent

**Capabilities:**
1. **Hinglish Translation**
   - "sasta mobile" → "cheap mobile"
   - "mehenga laptop" → "expensive laptop"

2. **Budget Extraction**
   - "50k" → 50000
   - "5 lakh" → 500000
   - "50 thousand" → 50000

3. **Attribute Extraction**
   - "red color" → { color: "red" }
   - "8GB RAM" → { ram: "8GB" }
   - "128GB storage" → { storage: "128GB" }

4. **Category Detection**
   - "mobile", "phone" → category: "mobile"
   - "laptop" → category: "laptop"
   - "charger", "cover" → category: "accessory"

5. **Keyword Extraction**
   - Removes filler words
   - Extracts meaningful terms

**File:** `src/services/intentParser.js`

---

#### Search Service
**Responsibility:** Find relevant products

**Process:**
1. Parse user query using Intent Parser
2. Build MongoDB query with filters
3. Execute database search
4. Rank results using Ranking Service
5. Add match reasons
6. Apply pagination
7. Return formatted results

**Optimizations:**
- Fetch 2x results for better ranking
- Use MongoDB indexes
- Limit result set

**File:** `src/services/searchService.js`

---

#### Ranking Service
**Responsibility:** Score and rank products

**Algorithm:**
```
Final Score = (
  0.35 × Text Relevance Score +
  0.20 × Rating Score +
  0.15 × Price Score +
  0.15 × Stock Availability Score +
  0.10 × Sales Popularity Score +
  0.05 × Metadata Match Score
) × 100
```

**Individual Score Calculations:**

1. **Text Relevance (35%)**
   - Exact match in title: 1.0
   - Exact match in description: 0.7
   - Fuzzy match (>75% similar): 0.6-0.8
   - No match: 0.0

2. **Rating Score (20%)**
   - Formula: `rating / 5`
   - 5-star = 1.0, 3-star = 0.6

3. **Price Score (15%)**
   - Within budget: 1.0
   - 10% over: 0.7
   - 20% over: 0.4
   - >20% over: 0.1

4. **Stock Score (15%)**
   - In stock: 1.0
   - Out of stock: 0.3

5. **Sales Score (10%)**
   - Normalized: `sales / maxSales`

6. **Metadata Match (5%)**
   - Each matching attribute: +0.2
   - Max: 1.0

**File:** `src/services/rankingService.js`

---

### 4. **Utilities**

#### Fuzzy Matcher
**Responsibility:** Handle typos and spelling mistakes

**Algorithm:** Levenshtein Distance
- Calculates edit distance between strings
- Converts to similarity score (0-1)

**Brand Corrections:**
- "ifone" → "iphone"
- "samsang" → "samsung"
- "shaomi" → "xiaomi"

**File:** `src/utils/fuzzyMatcher.js`

---

#### Hinglish Mapper
**Responsibility:** Translate Hinglish to English

**Mappings:**
```javascript
{
  'sasta': 'cheap',
  'mehenga': 'expensive',
  'accha': 'good',
  'bada': 'large',
  'chota': 'small',
  'naya': 'new',
  // ... 30+ mappings
}
```

**File:** `src/utils/hinglishMapper.js`

---

#### Error Handler
**Responsibility:** Centralized error handling

**Features:**
- Custom ApiError class
- Mongoose error handling
- Development vs Production modes
- Consistent error format

**File:** `src/utils/errorHandler.js`

---

### 5. **Models**

#### Product Model
**Schema:**
```javascript
{
  title: String (indexed),
  description: String,
  price: Number (indexed),
  mrp: Number,
  rating: Number (indexed),
  stock: Number,
  sales: Number,
  metadata: {
    ram, storage, color, screenSize,
    brightness, model, brand, category,
    processor, battery, camera, os
  },
  timestamps: true
}
```

**Indexes:**
- Text index on title and description
- Compound index on price and rating
- Individual indexes for fast queries

**File:** `src/models/Product.js`

---

## Data Flow

### Search Request Flow

```
1. User sends query: "sasta iphone 50k"
   ↓
2. Search Controller receives request
   ↓
3. Intent Parser processes query:
   - Translates: "sasta" → "cheap"
   - Extracts budget: 50000
   - Keywords: ["cheap", "iphone"]
   - Category: "mobile"
   ↓
4. Search Service builds MongoDB query:
   {
     $or: [
       { title: /cheap|iphone/i },
       { description: /cheap|iphone/i }
     ],
     price: { $lte: 60000 }, // 20% buffer
     'metadata.category': /mobile/i
   }
   ↓
5. MongoDB returns matching products
   ↓
6. Ranking Service scores each product:
   - iPhone 12 (₹45,999): Score 87.5
   - iPhone 11 (₹39,999): Score 85.2
   - iPhone SE (₹29,999): Score 82.1
   ↓
7. Results sorted by score (highest first)
   ↓
8. Match reasons added:
   "Within budget, High rating, Popular choice"
   ↓
9. Pagination applied (top 50)
   ↓
10. Response sent to client with:
    - Parsed intent
    - Ranked results
    - Match reasons
    - Response time
```

---

## Ranking Algorithm Deep Dive

### Why Weighted Scoring?

Different signals have different importance:

1. **Text Relevance (35%)** - Most important
   - If product doesn't match query, it's irrelevant
   - Exact matches should rank higher

2. **Rating (20%)** - Quality indicator
   - Users trust high-rated products
   - Important for conversion

3. **Price (15%)** - Budget consideration
   - Tier-2/3 cities are price-sensitive
   - Within-budget products preferred

4. **Stock (15%)** - Availability
   - Can't buy if out of stock
   - But still show for awareness

5. **Sales (10%)** - Social proof
   - Popular products are trusted
   - Lower weight as it's a lagging indicator

6. **Metadata (5%)** - Attribute match
   - Nice to have, not critical
   - Bonus for exact attribute matches

### Example Calculation

**Query:** "red iphone 60k"

**Product:** iPhone 13 (128GB, Red)
- Price: ₹59,999
- Rating: 4.5/5
- Stock: 50
- Sales: 1200
- Color: Red

**Scoring:**
```
Text Relevance:
  - "iphone" in title: 1.0
  - "red" in metadata: +0.2
  - Average: 0.9
  
Rating Score:
  - 4.5 / 5 = 0.9

Price Score:
  - ₹59,999 <= ₹60,000
  - Score: 1.0

Stock Score:
  - 50 > 0
  - Score: 1.0

Sales Score:
  - 1200 / 5000 (max) = 0.24

Metadata Score:
  - Color match: 0.2

Final Score:
= (0.35 × 0.9) + (0.20 × 0.9) + (0.15 × 1.0) + 
  (0.15 × 1.0) + (0.10 × 0.24) + (0.05 × 0.2)
= 0.315 + 0.18 + 0.15 + 0.15 + 0.024 + 0.01
= 0.829 × 100
= 82.9
```

---

## Intent Parser Deep Dive

### Budget Extraction Patterns

```javascript
// Pattern 1: "50k", "50K"
Regex: /(\d+)\s*k\b/i
Examples: "50k", "30K", "100 k"

// Pattern 2: "50000", "50,000"
Regex: /(\d{4,})/
Examples: "50000", "100000"

// Pattern 3: "50 thousand", "50 hazaar"
Regex: /(\d+)\s*(thousand|hazaar|hajar)/i
Examples: "50 thousand", "30 hazaar"

// Pattern 4: "5 lakh", "5 lac"
Regex: /(\d+)\s*(lakh|lac)/i
Examples: "5 lakh", "2 lac"
```

### Attribute Extraction

```javascript
// Color
Colors: ['red', 'blue', 'black', ...]
Method: Simple includes check

// RAM
Regex: /(\d+)\s*gb\s*(ram)?/i
Examples: "8GB RAM", "8 gb", "8GB"

// Storage
Regex: /(\d+)\s*(gb|tb)\s*(storage|rom)?/i
Examples: "128GB", "1TB storage"

// Screen Size
Regex: /(\d+\.?\d*)\s*(inch|"|inches)/i
Examples: "6.1 inch", "15.6\""

// Battery
Regex: /(\d+)\s*mah/i
Examples: "5000mAh", "5000 mah"
```

---

## Performance Optimization

### 1. **Database Indexes**
```javascript
// Text search index
{ title: 'text', description: 'text' }

// Price and rating compound index
{ price: 1, rating: -1 }

// Individual indexes
{ title: 1 }
{ price: 1 }
{ rating: 1 }
```

### 2. **Query Optimization**
- Limit results to 50 (configurable)
- Fetch 2x for better ranking, then paginate
- Use lean() for faster queries
- Project only needed fields

### 3. **Response Time Targets**
- Target: < 1000ms
- Typical: 200-500ms
- Measured and returned in response

### 4. **Future Optimizations**
- Redis caching for popular queries
- Elasticsearch for full-text search
- CDN for static assets
- Database read replicas

---

## Scalability Considerations

### Horizontal Scaling
- Stateless design (no session storage)
- Load balancer ready
- Multiple server instances

### Database Scaling
- MongoDB sharding by category
- Read replicas for search queries
- Write master for product updates

### Caching Strategy
```
┌─────────────┐
│   Redis     │ ← Popular queries (TTL: 5 min)
└─────────────┘
       ↓
┌─────────────┐
│  MongoDB    │ ← All products
└─────────────┘
```

### Microservice Architecture (Future)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Product    │  │    Search    │  │   Ranking    │
│   Service    │  │   Service    │  │   Service    │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "query": "sasta iphone 50k",
  "parsedIntent": {
    "originalQuery": "sasta iphone 50k",
    "translatedQuery": "cheap iphone 50k",
    "keywords": ["cheap", "iphone"],
    "budget": 50000,
    "attributes": {},
    "category": "mobile",
    "isHinglish": true
  },
  "results": [
    {
      "id": "...",
      "title": "iPhone 12 (128GB, Black)",
      "price": 45999,
      "rating": 4.3,
      "score": 87.5,
      "matchReason": "Within budget, High rating, Popular choice"
    }
  ],
  "count": 15,
  "totalMatches": 45,
  "responseTime": "245ms"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Please provide a search query",
  "code": "MISSING_QUERY"
}
```

---

## Conclusion

This architecture is designed for:
- ✅ **Performance**: Sub-1000ms response times
- ✅ **Scalability**: Horizontal scaling ready
- ✅ **Maintainability**: Clean separation of concerns
- ✅ **Extensibility**: Easy to add new features
- ✅ **User Experience**: Intelligent search with Hinglish support

Perfect for Tier-2 and Tier-3 cities in India! 🇮🇳
