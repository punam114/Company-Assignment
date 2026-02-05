# 🧪 Testing Guide

## Quick Test Commands

### 1. **Health Check**
```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-04T08:00:00.000Z"
}
```

---

### 2. **Create Product**
```bash
curl -X POST http://localhost:5000/api/v1/product \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 15 Pro Max",
    "description": "Latest Apple flagship with A17 Pro chip",
    "price": 134900,
    "mrp": 159900,
    "rating": 4.8,
    "stock": 25,
    "sales": 450,
    "metadata": {
      "brand": "Apple",
      "model": "iPhone 15 Pro Max",
      "category": "mobile",
      "ram": "8GB",
      "storage": "256GB",
      "color": "Titanium Blue",
      "screenSize": "6.7 inch",
      "brightness": "2000 nits",
      "battery": "4422mAh",
      "camera": "48MP",
      "os": "iOS 17"
    }
  }'
```

---

### 3. **Search Tests**

#### Basic Search
```bash
curl "http://localhost:5000/api/v1/search/product?query=iphone"
```

#### Hinglish Search
```bash
curl "http://localhost:5000/api/v1/search/product?query=sasta%20mobile"
```

#### Budget Search
```bash
curl "http://localhost:5000/api/v1/search/product?query=iphone%2050k"
```

#### Attribute Search
```bash
curl "http://localhost:5000/api/v1/search/product?query=red%20color%20phone"
```

#### Fuzzy Search (Typo)
```bash
curl "http://localhost:5000/api/v1/search/product?query=ifone"
```

#### Complex Query
```bash
curl "http://localhost:5000/api/v1/search/product?query=sasta%20iphone%2050k%20red%20color"
```

---

### 4. **Category Search**
```bash
curl "http://localhost:5000/api/v1/search/category/mobile"
curl "http://localhost:5000/api/v1/search/category/laptop"
curl "http://localhost:5000/api/v1/search/category/accessory"
```

---

### 5. **Price Range Search**
```bash
curl "http://localhost:5000/api/v1/search/price?min=20000&max=50000"
```

---

### 6. **Trending Products**
```bash
curl "http://localhost:5000/api/v1/search/trending"
```

---

### 7. **Update Product Metadata**
```bash
curl -X PUT http://localhost:5000/api/v1/product/meta-data \
  -H "Content-Type: application/json" \
  -d '{
    "id": "PRODUCT_ID_HERE",
    "metadata": {
      "ram": "12GB",
      "storage": "512GB"
    }
  }'
```

---

## Test Scenarios

### Scenario 1: Tier-2 City User (Hinglish)
**Query:** "sasta accha mobile 30k ke andar"

**Expected:**
- Translates "sasta" → "cheap"
- Translates "accha" → "good"
- Extracts budget: 30000
- Returns phones under ₹30k with good ratings

---

### Scenario 2: Typo in Brand Name
**Query:** "samsang galaxy"

**Expected:**
- Corrects "samsang" → "samsung"
- Returns Samsung Galaxy phones

---

### Scenario 3: Budget + Attribute
**Query:** "8gb ram laptop 60k"

**Expected:**
- Extracts RAM: "8GB"
- Extracts budget: 60000
- Returns laptops with 8GB RAM under ₹60k

---

### Scenario 4: Color Preference
**Query:** "red iphone"

**Expected:**
- Detects color: "red"
- Returns red iPhones
- Metadata match bonus in ranking

---

### Scenario 5: Out of Stock Handling
**Expected:**
- Out of stock products still shown
- But ranked lower (stock score = 0.3)

---

## Performance Testing

### Response Time Test
```bash
# Run 10 searches and measure time
for i in {1..10}; do
  curl -w "\nTime: %{time_total}s\n" \
    "http://localhost:5000/api/v1/search/product?query=iphone"
done
```

**Target:** All responses < 1000ms

---

## Ranking Validation

### Test Case 1: Price Preference
**Query:** "iphone 50k"

**Expected Order:**
1. iPhone within budget, high rating
2. iPhone slightly over budget, high rating
3. iPhone within budget, lower rating

---

### Test Case 2: Rating Importance
**Query:** "mobile"

**Expected:**
- High-rated products rank higher
- Even if slightly more expensive

---

### Test Case 3: Stock Availability
**Expected:**
- In-stock products rank higher
- Out-of-stock products appear but lower

---

## Edge Cases

### 1. Empty Query
```bash
curl "http://localhost:5000/api/v1/search/product?query="
```
**Expected:** Error - "Please provide a search query"

---

### 2. No Results
```bash
curl "http://localhost:5000/api/v1/search/product?query=xyz123nonexistent"
```
**Expected:** Empty results array

---

### 3. Very High Budget
```bash
curl "http://localhost:5000/api/v1/search/product?query=mobile%201000000"
```
**Expected:** All products returned, ranked by other factors

---

### 4. Special Characters
```bash
curl "http://localhost:5000/api/v1/search/product?query=iphone%20%40%23%24"
```
**Expected:** Handles gracefully, ignores special chars

---

## Database Validation

### Check Product Count
```javascript
// In MongoDB shell or Compass
db.products.countDocuments()
// Expected: 1000
```

### Check Categories
```javascript
db.products.aggregate([
  { $group: { _id: "$metadata.category", count: { $sum: 1 } } }
])
// Expected: mobile: 500, laptop: 300, accessory: 200
```

### Check Price Range
```javascript
db.products.aggregate([
  { $group: { 
    _id: null, 
    minPrice: { $min: "$price" },
    maxPrice: { $max: "$price" }
  }}
])
```

---

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Jumbotail Search Engine",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Search - Basic",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/v1/search/product?query=iphone"
      }
    },
    {
      "name": "Search - Hinglish",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/v1/search/product?query=sasta mobile"
      }
    },
    {
      "name": "Create Product",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/v1/product",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Test Product\",\n  \"description\": \"Test Description\",\n  \"price\": 25000,\n  \"mrp\": 30000,\n  \"rating\": 4.0,\n  \"stock\": 10,\n  \"sales\": 100\n}"
        }
      }
    }
  ]
}
```

---

## Automated Testing Script

Create `test.js`:

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

const tests = [
  {
    name: 'Basic Search',
    url: `${BASE_URL}/api/v1/search/product?query=iphone`,
    expected: res => res.data.success === true
  },
  {
    name: 'Hinglish Search',
    url: `${BASE_URL}/api/v1/search/product?query=sasta mobile`,
    expected: res => res.data.parsedIntent.isHinglish === true
  },
  {
    name: 'Budget Extraction',
    url: `${BASE_URL}/api/v1/search/product?query=iphone 50k`,
    expected: res => res.data.parsedIntent.budget === 50000
  }
];

async function runTests() {
  for (const test of tests) {
    try {
      const res = await axios.get(test.url);
      const passed = test.expected(res);
      console.log(`${passed ? '✅' : '❌'} ${test.name}`);
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
    }
  }
}

runTests();
```

Run with:
```bash
node test.js
```

---

## Success Criteria

✅ All endpoints return 200 OK  
✅ Search response time < 1000ms  
✅ Hinglish queries translated correctly  
✅ Budget extracted accurately  
✅ Fuzzy matching works for typos  
✅ Ranking algorithm produces sensible results  
✅ 1000 products generated successfully  
✅ No database errors  
✅ Error handling works correctly  

---

## Common Issues

### Issue 1: MongoDB Connection Failed
**Solution:** 
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Try: `mongod` to start MongoDB

### Issue 2: Port Already in Use
**Solution:**
- Change PORT in .env
- Or kill process: `npx kill-port 5000`

### Issue 3: No Search Results
**Solution:**
- Run data generator: `npm run generate-data`
- Check database: `db.products.countDocuments()`

---

Happy Testing! 🚀
