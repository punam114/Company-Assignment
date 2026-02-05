# ⚡ Quick Start Guide

Get the Jumbotail Search Engine running in 5 minutes!

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- ✅ **Git** (optional) - [Download](https://git-scm.com/)

### Check Installations

```bash
# Check Node.js version
node --version
# Should show v16.x.x or higher

# Check npm version
npm --version
# Should show 8.x.x or higher

# Check MongoDB
mongod --version
# Should show v5.x.x or higher
```

---

## 🚀 Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd "c:\Masai Full Time\Company-Assignment\Jumbotail"
```

### Step 2: Install Dependencies

```bash
# If you get PowerShell execution policy error, run:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Then install dependencies
npm install
```

**Expected Output:**
```
added 125 packages in 20s
found 0 vulnerabilities
```

### Step 3: Start MongoDB

Open a **new terminal** and run:

```bash
mongod
```

**Expected Output:**
```
[initandlisten] waiting for connections on port 27017
```

> ⚠️ **Keep this terminal open!** MongoDB needs to run in the background.

### Step 4: Generate Test Data

In your **original terminal**, run:

```bash
npm run generate-data
```

**Expected Output:**
```
✅ MongoDB Connected
🗑️  Clearing existing products...
📱 Generating 500 mobile phones...
💻 Generating 300 laptops...
🎧 Generating 200 accessories...
💾 Inserting products into database...
✅ Successfully generated 1000 products!
```

### Step 5: Start the Server

```bash
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000
📚 API Docs: http://localhost:5000/
```

---

## ✅ Verify Installation

### Test 1: Health Check

Open your browser and visit:
```
http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-04T08:00:00.000Z"
}
```

### Test 2: API Documentation

Visit:
```
http://localhost:5000/
```

You should see the API documentation with all available endpoints.

### Test 3: Basic Search

Visit:
```
http://localhost:5000/api/v1/search/product?query=iphone
```

**Expected Response:**
```json
{
  "success": true,
  "query": "iphone",
  "parsedIntent": { ... },
  "results": [ ... ],
  "count": 15,
  "responseTime": "245ms"
}
```

---

## 🧪 Quick Tests

### Test Hinglish Support

```bash
curl "http://localhost:5000/api/v1/search/product?query=sasta%20mobile"
```

### Test Budget Extraction

```bash
curl "http://localhost:5000/api/v1/search/product?query=iphone%2050k"
```

### Test Fuzzy Matching

```bash
curl "http://localhost:5000/api/v1/search/product?query=ifone"
```

### Test Attribute Search

```bash
curl "http://localhost:5000/api/v1/search/product?query=red%20color%20phone"
```

---

## 📱 Using Postman

1. Open Postman
2. Create a new GET request
3. Enter URL: `http://localhost:5000/api/v1/search/product`
4. Add query parameter: `query` = `iphone`
5. Click **Send**

---

## 🎯 Common Use Cases

### 1. Search for Products

**URL:** `GET /api/v1/search/product?query=YOUR_QUERY`

**Examples:**
```
/api/v1/search/product?query=iphone
/api/v1/search/product?query=sasta mobile
/api/v1/search/product?query=laptop 60k
/api/v1/search/product?query=8gb ram phone
```

### 2. Create a Product

**URL:** `POST /api/v1/product`

**Body:**
```json
{
  "title": "Samsung Galaxy S23",
  "description": "Latest Samsung flagship",
  "price": 74999,
  "mrp": 89999,
  "rating": 4.6,
  "stock": 30,
  "sales": 250,
  "metadata": {
    "brand": "Samsung",
    "category": "mobile",
    "ram": "8GB",
    "storage": "256GB",
    "color": "Phantom Black"
  }
}
```

### 3. Get Trending Products

**URL:** `GET /api/v1/search/trending`

### 4. Search by Category

**URL:** `GET /api/v1/search/category/mobile`

---

## 🛠️ Troubleshooting

### Issue 1: MongoDB Connection Failed

**Error:** `MongoDB Connection Error`

**Solution:**
1. Check if MongoDB is running: `mongod`
2. Verify MongoDB URI in `.env` file
3. Try: `mongodb://127.0.0.1:27017/jumbotail`

### Issue 2: Port 5000 Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
1. Change port in `.env`: `PORT=3000`
2. Or kill the process using port 5000

### Issue 3: No Search Results

**Error:** Empty results array

**Solution:**
1. Run data generator: `npm run generate-data`
2. Check database: Open MongoDB Compass, connect to `mongodb://localhost:27017`, check `jumbotail` database

### Issue 4: npm install fails

**Error:** PowerShell execution policy

**Solution:**
```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

---

## 📂 Project Structure

```
Jumbotail/
├── src/
│   ├── server.js           # Start here!
│   ├── models/             # Database schemas
│   ├── controllers/        # Request handlers
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   └── utils/              # Helper functions
├── scripts/
│   └── generateProducts.js # Data generator
├── README.md               # Full documentation
├── ARCHITECTURE.md         # System design
├── TESTING.md              # Test guide
└── package.json            # Dependencies
```

---

## 🎓 Next Steps

1. ✅ **Read Documentation**
   - `README.md` - Overview
   - `ARCHITECTURE.md` - System design
   - `TESTING.md` - Test cases

2. ✅ **Explore the Code**
   - Start with `src/server.js`
   - Then `src/services/intentParser.js`
   - Then `src/services/rankingService.js`

3. ✅ **Run Tests**
   - Try all examples in `TESTING.md`
   - Create your own products
   - Test different queries

4. ✅ **Prepare for Interview**
   - Read `INTERVIEW_PREP.md`
   - Practice explaining the ranking algorithm
   - Be ready to demo the application

---

## 📞 Support

If you encounter any issues:

1. Check `TESTING.md` for common problems
2. Review error messages carefully
3. Verify all prerequisites are installed
4. Check MongoDB is running

---

## 🎉 Success!

If you see this response from `/api/v1/search/product?query=iphone`, you're all set:

```json
{
  "success": true,
  "query": "iphone",
  "results": [ ... ],
  "responseTime": "245ms"
}
```

**Congratulations! Your search engine is running! 🚀**

---

## 📚 Quick Reference

### NPM Scripts

```bash
npm start              # Production mode
npm run dev            # Development mode (auto-restart)
npm run generate-data  # Generate 1000 fake products
```

### Environment Variables

```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/jumbotail
NODE_ENV=development
MAX_RESULTS=50
```

### Key Endpoints

```
GET  /health                           # Health check
GET  /                                 # API documentation
GET  /api/v1/search/product?query=     # Main search
POST /api/v1/product                   # Create product
GET  /api/v1/search/trending           # Trending products
```

---

**Happy Coding! 🎯**
