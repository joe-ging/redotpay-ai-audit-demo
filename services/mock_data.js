const transactions = [
    {
        id: "TXN_001",
        userId: "USER_0410",
        date: "2026-03-09T14:20:00Z",
        amount: 15.50,
        currency: "USD",
        status: "COMPLETED",
        description: "Starbucks Hong Kong",
        type: "PURCHASE"
    },
    {
        id: "TXN_002",
        userId: "USER_0410",
        date: "2026-03-10T10:00:00Z",
        amount: 120.00,
        currency: "USD",
        status: "DECLINED",
        description: "Apple Store Online",
        type: "PURCHASE",
        reason: "Insufficient Funds"
    },
    {
        id: "TXN_003",
        userId: "USER_0410",
        date: "2026-03-10T09:30:00Z",
        amount: 200.00,
        currency: "USDT",
        status: "COMPLETED",
        description: "Deposit from Binance",
        type: "DEPOSIT"
    }
];

const cards = [
    {
        id: "CARD_9922",
        userId: "USER_0410",
        last4: "9922",
        status: "ACTIVE",
        type: "VIRTUAL"
    }
];

module.exports = { transactions, cards };
