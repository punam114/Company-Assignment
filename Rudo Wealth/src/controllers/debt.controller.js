const debtService = require('../services/debt.service');

// Get simplified debts for a group
exports.getSimplifiedDebts = async (req, res) => {
    try {
        const transactions = await debtService.simplifyDebts(req.params.groupId);
        res.json(transactions);
    } catch (error) {
        console.error('Error in getSimplifiedDebts:', error);
        res.status(500).json({ message: 'Failed to calculate group debts: ' + error.message });
    }
};

// Get global simplified debts
exports.getGlobalSimplifiedDebts = async (req, res) => {
    try {
        const transactions = await debtService.simplifyDebts(null);
        res.json(transactions);
    } catch (error) {
        console.error('Error in getGlobalSimplifiedDebts:', error);
        res.status(500).json({ message: 'Failed to calculate global debts: ' + error.message });
    }
};
