const Settlement = require('../models/Settlement');
const Group = require('../models/Group');
const User = require('../models/User');
const notificationService = require('../services/notification.service');

// Record a payment between users
exports.recordSettlement = async (req, res) => {
    try {
        const { payee, amount, group } = req.body;
        const payer = req.user._id;

        const settlement = await Settlement.create({
            payer,
            payee,
            amount,
            group,
            status: 'COMPLETED',
        });

        // Notify payee
        const payeeUser = await User.findById(payee);
        if (payeeUser && payeeUser.fcmToken) {
            await notificationService.sendNotification(
                payeeUser.fcmToken,
                'Payment Received',
                `${req.user.displayName || 'Someone'} paid you ${amount}`
            );
        }

        res.status(201).json(settlement);
    } catch (error) {
        console.error('Error in recordSettlement:', error);
        res.status(500).json({ message: 'Failed to record settlement: ' + error.message });
    }
};

// Get all settlements for a group
exports.getGroupSettlements = async (req, res) => {
    try {
        const settlements = await Settlement.find({ group: req.params.groupId })
            .populate('payer', 'displayName email')
            .populate('payee', 'displayName email');

        res.json(settlements);
    } catch (error) {
        console.error('Error in getGroupSettlements:', error);
        res.status(500).json({ message: 'Failed to fetch settlements: ' + error.message });
    }
};
