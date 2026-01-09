# RuDo Wealth - Advanced Expense Management System

RuDo Wealth is a robust, production-grade backend service designed to manage shared group expenses, facilitate real-time debt tracking, and optimize settlements. Built with the MERN stack and integrated with Firebase Authentication, it provides a secure and seamless experience for splitting bills and simplifying complex financial relationships.

## 🚀 Key Features

- **Secure Authentication**: Integrated with Firebase Admin SDK for JWT-based token verification.
- **Dynamic Group Management**: Create groups, manage memberships, and track shared activities.
- **Advanced Split Engine**: Support for Equal, Percentage-based, and Exact amount expense splitting.
- **Debt Simplification Algorithm**: An optimized greedy algorithm that minimizes the number of transactions required to settle debts across a group.
- **Automated User Lifecycle**: Instant MongoDB user synchronization upon first verified Firebase login.
- **Real-time Balance Tracking**: Instant calculation of net personal and group-wise balances.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Security**: Firebase Admin SDK (JWT), Helmet.js
- **Environment**: Dotenv
- **Testing**: Postman

## 📁 System Architecture

```text
src/
├── config/       # Configuration for Firebase and MongoDB
├── controllers/  # Request handlers and business logic
├── middleware/   # Authentication and error handling
├── models/       # Mongoose schemas (User, Group, Expense, Settlement)
├── routes/       # API endpoint definitions
└── services/     # core algorithms (Debt Simplification, Balances)
```

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd rudo-wealth
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/your/key.json
   NODE_ENV=development
   ```

4. **Add Firebase Credentials**:
   Place your `serviceAccountKey.json` in the root folder.

5. **Run the application**:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🧪 API Documentation

The full API specification is available via the Postman collection located in `/tests`.

### Core Endpoints:
- `POST /api/auth/signup` - Sync Firebase user with local database
- `POST /api/auth/login` - Verify login and retrieve profile
- `POST /api/expenses` - Create a new shared expense
- `GET /api/debts/group/:id` - Retrieve simplified settlement report

## 🛡 Security & Best Practices

- Standardized JWT authentication middleware.
- Input validation at the controller level.
- Sanitized database queries via Mongoose.
- Environmental separation (Development/Production).

---
*Developed as part of the RuDo Wealth Technical Challenge.*
