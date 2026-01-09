const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const initFirebase = require('./config/firebase');
require('dotenv').config();

const app = express();

// Initialize Services
initFirebase();
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('RuDo Wealth API is running');
});

// Import and use routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const groupRoutes = require('./routes/group.routes');
const expenseRoutes = require('./routes/expense.routes');
const debtRoutes = require('./routes/debt.routes');
const settlementRoutes = require('./routes/settlement.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/settlements', settlementRoutes);

module.exports = app;
