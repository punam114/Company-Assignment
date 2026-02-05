# 🛒 Jumbotail Search Engine

A simple and beginner-friendly search engine microservice for electronics. It features Hinglish support and a weighted ranking algorithm.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas)

### 2. Installation
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Open .env and add your MONGODB_URI
```

### 3. Seed Data
```bash
# Generate 1000 sample products
npm run generate-data
```

### 4. Run the Server
```bash
# For development
npm run dev

# For production
npm start
```

## 📡 API Endpoints

- **GET** `/api/v1/search/product?query=iphone` - Search for products
- **GET** `/api/v1/search/category/mobile` - Search by category
- **GET** `/health` - Check if server is running

### Example Queries
- `sasta iphone` (Hinglish for cheap iphone)
- `best camera phone under 50k`
- `ifone` (Fuzzy matching for iPhone)

## 📁 Project Structure

- `src/models/` - Database schemas
- `src/controllers/` - Request handlers
- `src/routes/` - API path definitions
- `src/services/` - Business logic (Search & Ranking)
- `src/utils/` - Helper functions
- `server.js` - Main entry point

## �️ Tech Stack
- Express.js
- MongoDB & Mongoose
- fast-levenshtein (for fuzzy matching)
- dotenv

---
Built for learning and simplicity.
