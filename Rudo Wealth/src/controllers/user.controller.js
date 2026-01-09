const User = require('../models/User');
const balanceService = require('../services/balance.service');

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ message: 'Failed to fetch profile: ' + error.message });
    }
};

// Get user balances across all groups
exports.getBalances = async (req, res) => {
    try {
        const balances = await balanceService.calculateBalances(req.user._id);
        res.json(balances);
    } catch (error) {
        console.error('Error in getBalances:', error);
        res.status(500).json({ message: 'Failed to calculate balances: ' + error.message });
    }
};
