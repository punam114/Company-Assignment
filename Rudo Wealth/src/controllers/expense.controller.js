const Expense = require('../models/Expense');
const Group = require('../models/Group');
const User = require('../models/User');
const notificationService = require('../services/notification.service');

// Create a new expense and split it among participants
exports.createExpense = async (req, res) => {
    try {
        const { description, amount, payer, group, splitType, participants } = req.body;

        if (group) {
            const groupDoc = await Group.findById(group);
            if (!groupDoc || !groupDoc.members.includes(req.user._id)) {
                return res.status(403).json({ message: 'Access denied: Not a member of this group' });
            }
            for (const p of participants) {
                if (!groupDoc.members.includes(p.user)) {
                    return res.status(400).json({ message: `User ${p.user} is not in this group` });
                }
            }
        }

        let processedParticipants = participants;
        if (splitType === 'EQUAL') {
            const count = participants.length;
            const equalAmount = amount / count;
            processedParticipants = participants.map(p => ({ user: p.user, amount: equalAmount }));

        } else if (splitType === 'PERCENT') {
            let totalPercent = 0;
            processedParticipants = participants.map(p => {
                totalPercent += p.percentage;
                return { user: p.user, amount: (p.percentage / 100) * amount, percentage: p.percentage };
            });
            if (Math.abs(totalPercent - 100) > 0.01) {
                return res.status(400).json({ message: 'Error: Percentages must sum to 100%' });
            }

        } else if (splitType === 'EXACT') {
            let totalAmount = 0;
            for (const p of participants) totalAmount += p.amount;
            if (Math.abs(totalAmount - amount) > 0.01) {
                return res.status(400).json({ message: 'Error: Exact amounts must sum to total' });
            }
        }

        const expense = await Expense.create({
            description,
            amount,
            payer,
            group,
            splitType,
            participants: processedParticipants,
            createdBy: req.user._id,
        });

        for (const p of processedParticipants) {
            if (p.user.toString() !== req.user._id.toString()) {
                const participantUser = await User.findById(p.user);
                if (participantUser && participantUser.fcmToken) {
                    await notificationService.sendNotification(
                        participantUser.fcmToken,
                        'New Shared Expense',
                        `${req.user.displayName || 'Someone'} added "${description}"`
                    );
                }
            }
        }

        res.status(201).json(expense);
    } catch (error) {
        console.error('Error in createExpense:', error);
        res.status(500).json({ message: 'Failed to create expense: ' + error.message });
    }
};

// Retrieve all expenses for a group
exports.getGroupExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ group: req.params.groupId })
            .populate('payer', 'displayName email')
            .populate('participants.user', 'displayName email');
        res.json(expenses);
    } catch (error) {
        console.error('Error in getGroupExpenses:', error);
        res.status(500).json({ message: 'Failed to fetch expenses: ' + error.message });
    }
};

// Update an expense
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.expenseId);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        if (expense.createdBy.toString() !== req.user._id.toString() &&
            expense.payer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to edit this expense' });
        }

        Object.assign(expense, req.body);
        await expense.save();
        res.json({ message: 'Expense updated successfully', expense });
    } catch (error) {
        console.error('Error in updateExpense:', error);
        res.status(500).json({ message: 'Failed to update expense: ' + error.message });
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.expenseId);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        if (expense.createdBy.toString() !== req.user._id.toString() &&
            expense.payer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this expense' });
        }

        await Expense.deleteOne({ _id: req.params.expenseId });
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error in deleteExpense:', error);
        res.status(500).json({ message: 'Failed to delete expense: ' + error.message });
    }
};
