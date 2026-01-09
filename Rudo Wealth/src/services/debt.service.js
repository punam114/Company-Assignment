const balanceService = require('./balance.service');

/**
 * Debt Simplification Algorithm (Min Cash Flow)
 * 1. Calculate net balance for each user.
 * 2. Separate into "Givers" (negative balance) and "Receivers" (positive balance).
 * 3. Match them to minimize transactions.
 */
exports.simplifyDebts = async (groupId = null) => {
    const allBalances = await balanceService.calculateBalances(null, groupId);

    const participants = Object.keys(allBalances).map(uid => ({
        uid,
        balance: allBalances[uid]
    })).filter(p => Math.abs(p.balance) > 0.01);

    const transactions = [];

    const givers = participants.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
    const receivers = participants.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);

    let gIdx = 0;
    let rIdx = 0;

    while (gIdx < givers.length && rIdx < receivers.length) {
        const giver = givers[gIdx];
        const receiver = receivers[rIdx];

        const amount = Math.min(Math.abs(giver.balance), receiver.balance);

        transactions.push({
            from: giver.uid,
            to: receiver.uid,
            amount: Number(amount.toFixed(2))
        });

        giver.balance += amount;
        receiver.balance -= amount;

        if (Math.abs(giver.balance) < 0.01) gIdx++;
        if (Math.abs(receiver.balance) < 0.01) rIdx++;
    }

    return transactions;
};
