const User = require('../models/User');

// Confirm user signup and return the user profile
exports.signup = async (req, res) => {
    try {
        // req.user is already populated by verifyToken middleware
        res.status(201).json({
            message: 'User registered and synced successfully',
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ message: 'Signup failed: ' + error.message });
    }
};

// Confirm user login and return the user profile
exports.login = async (req, res) => {
    try {
        // req.user is already populated by verifyToken middleware
        res.json({
            message: 'Login successful',
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed: ' + error.message });
    }
};
