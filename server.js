const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { transactions, cards } = require('./services/mock_data');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 🛰️ RedotPay Track 3: Actionable Intelligent CX Prototype
 * Architecture: Intent Router + Domain-Specific Agents + HITL Escalation
 */

// 🔹 Domain Agents Logic Simulation
const domainAgents = {
    FAQ: (msg) => {
        return { text: "INFO: You can apply for a RedotPay physical card in the app under the 'Card' tab. Fee is $100.", action: "FAQ_RESOLVE" };
    },
    Ops: (msg) => {
        const lastDeclined = transactions.find(t => t.status === "DECLINED");
        return {
            text: `ACTION: I've audited your last payment at "${lastDeclined.description}". It was declined due to "${lastDeclined.reason}". Shall I check your balance?`,
            action: "AUDIT_RECOVERY",
            data: lastDeclined
        };
    },
    Risk: (msg) => {
        return {
            text: "🚨 SECURITY ACTION: I've detected a high-sensitivity request. I am temporarily locking your Virtual Card *9922 for your protection. Confirm to proceed?",
            action: "SECURITY_PROTOCOL",
            priority: "CRITICAL"
        };
    },
    Balance: (msg) => {
        return {
            text: "Your current liquidity is 1,240.50 USDT. You have an additional 0.42 BTC in 'Earn' vaults.",
            action: "FINANCIAL_SNAPSHOT"
        };
    }
};

app.post('/api/agent/chat', (req, res) => {
    const { message } = req.body;
    const msg = (message || "").toLowerCase();

    // Simulate AI Latency (148ms target)
    setTimeout(() => {
        // 🏗️ Multi-Layer Intent Router (Layer 1: Classification)
        let category = "UNK";
        if (msg.includes("how") || msg.includes("apply") || msg.includes("can i")) category = "FAQ";
        if (msg.includes("why") || msg.includes("order") || msg.includes("declined") || msg.includes("status")) category = "Ops";
        if (msg.includes("lost") || msg.includes("stolen") || msg.includes("block") || msg.includes("freeze")) category = "Risk";
        if (msg.includes("balance") || msg.includes("money") || msg.includes("usdt")) category = "Balance";

        // 🤝 Human-in-the-Loop (HITL) Trigger
        if (msg.includes("human") || msg.includes("agent") || msg.includes("person") || msg.includes("operator")) {
            return res.json({
                text: "Handing over to a RedotPay Human Specialist. Estimated wait time: 2 mins.",
                action: "HITL_ESCALATION",
                confidence_score: 0.1
            });
        }

        // 🤖 Routing to Specialized Domain Agents
        if (category !== "UNK") {
            const response = domainAgents[category](msg);
            return res.json({
                ...response,
                confidence_score: 0.98,
                architecture: "Multi-Agent-Core-V1"
            });
        }

        // 📉 Default / Low Confidence Case
        res.json({
            text: "I'm not sure about that. I can help with 'How to apply', 'Transaction status', 'Balance', or 'Card security'. Or type 'human' to talk to us.",
            action: "GREETING",
            confidence_score: 0.45
        });
    }, 600); // 600ms artificial delay for "AI Thinking" vibe
});

app.listen(PORT, () => {
    console.log(`🚀 RedotPay Track 3: AI-Automation Prototype Active at http://localhost:${PORT}`);
    console.log(`📌 Public URL: Open index.html through the browser servier.`);
});
