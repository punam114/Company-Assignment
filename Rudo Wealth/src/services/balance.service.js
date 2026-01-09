const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const User = require('../models/User');

/**
 * Calculates net balances for a user or a group.
 * Returns a map of user ID to net balance (positive means owed, negative means owes).
 */
exports.calculateBalances = async (userId, groupId = null) => {
    const query = {};
    if (groupId) query.group = groupId;

    const expenses = await Expense.find(query);
    const settlements = await Settlement.find(query);

    const balances = {}; // userId -> amount

    // Process expenses
    expenses.forEach(exp => {
        const payerId = exp.payer.toString();

        exp.participants.forEach(p => {
            const participantId = p.user.toString();
            const amount = p.amount;

            if (payerId !== participantId) {
                // Participant owes Payer
                balances[payerId] = (balances[payerId] || 0) + amount;
                balances[participantId] = (balances[participantId] || 0) - amount;
            }
        });
    });

    // Process settlements
    settlements.forEach(set => {
        const payerId = set.payer.toString();
        const payeeId = set.payee.toString();
        const amount = set.amount;

        // Payer paid Payee -> Payer's debt decreases, Payee's asset decreases
        balances[payerId] = (balances[payerId] || 0) + amount;
        balances[payeeId] = (balances[payeeId] || 0) - amount;
    });

    return balances;
};

/**
 * Returns detailed balance (to whom user owes and who owes user)
 */
exports.getDetailedBalance = async (userId) => {
    const expenses = await Expense.find({ $or: [{ payer: userId }, { 'participants.user': userId }] });
    const settlements = await Settlement.find({ $or: [{ payer: userId }, { payee: userId }] });

    const netMatrix = {}; // otherUserId -> amount (positive means they owe me)

    expenses.forEach(exp => {
        const payerId = exp.payer.toString();
        exp.participants.forEach(p => {
            const partId = p.user.toString();
            if (payerId === userId.toString() && partId !== userId.toString()) {
                netMatrix[partId] = (netMatrix[partId] || 0) + p.amount;
            } else if (partId === userId.toString() && payerId !== userId.toString()) {
                netMatrix[payerId] = (netMatrix[payerId] || 0) - p.amount;
            }
        });
    });

    settlements.forEach(set => {
        const payerId = set.payer.toString();
        const payeeId = set.payee.toString();
        if (payerId === userId.toString()) {
            netMatrix[payeeId] = (netMatrix[payeeId] || 0) + set.amount;
        } else if (payeeId === userId.toString()) {
            netMatrix[payerId] = (netMatrix[payerId] || 0) - set.amount;
        }
    });

    return netMatrix;
};
