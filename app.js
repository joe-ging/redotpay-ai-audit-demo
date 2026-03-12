// Mock Data (matches backend for consistency)
const transactions = [
    { id: "TXN_002", amount: 120.00, currency: "USD", status: "DECLINED", description: "Apple Store Online", date: "Today, 10:00 AM", icon: "🍏", reason: "Insufficient Funds" },
    { id: "TXN_001", amount: 15.50, currency: "USD", status: "COMPLETED", description: "Starbucks Hong Kong", date: "Yesterday, 2:20 PM", icon: "☕" },
    { id: "TXN_003", amount: 200.00, currency: "USDT", status: "COMPLETED", description: "Deposit from Binance", date: "Today, 9:30 AM", icon: "🪙" }
];

// State Management
let currentContext = null;

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
    setupChat();
});

function loadTransactions() {
    const container = document.getElementById('tx-items');
    container.innerHTML = transactions.map(t => `
        <div class="tx-item">
            <div class="tx-main">
                <div class="tx-icon">${t.icon}</div>
                <div class="tx-desc">
                    <span class="store">${t.description}</span>
                    <span class="date">${t.date}</span>
                </div>
            </div>
            <div class="tx-amt">
                <span class="amt-val">${t.amount.toFixed(2)} ${t.currency}</span>
                <span class="amt-status ${t.status.toLowerCase()}">${t.status}</span>
            </div>
        </div>
    `).join('');
}

function setupChat() {
    const input = document.getElementById('chat-input');
    const btn = document.getElementById('send-btn');

    btn.addEventListener('click', () => handleUserInput());
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });
}

function sendHint(text) {
    document.getElementById('chat-input').value = text;
    handleUserInput();
}

// 🔹 Domain Agents Logic Simulation (Migrated from Server for Static Hosting)
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

async function handleUserInput() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    // Show typing indicator
    const typingId = addMessage("Analyzing intent...", 'bot typing');
    addLog("[NLP] Input detected: " + text, 'info');

    // Simulate Network Latency
    setTimeout(() => {
        const msg = text.toLowerCase();
        let category = "UNK";
        
        // --- 🏗️ CONTEXT-AWARE ROUTING (Intelligence Boost) ---
        
        // Handle Confirmations (Yes/Sure/Okay)
        if (currentContext === "AUDIT_RECOVERY" && (msg.includes("sure") || msg.includes("yes") || msg.includes("ok") || msg.includes("go ahead"))) {
            category = "Balance";
            currentContext = null;
        } 
        // Handle "No/Stop"
        else if (currentContext && (msg.includes("no") || msg.includes("stop") || msg.includes("nevermind"))) {
            addMessage("Understood. Let me know if you need anything else.", "bot");
            currentContext = null;
            document.getElementById(typingId).remove();
            return;
        }
        // Normal Intent Detection
        else {
            if (msg.includes("how") || msg.includes("apply") || msg.includes("can i")) category = "FAQ";
            if (msg.includes("why") || msg.includes("order") || msg.includes("declined") || msg.includes("status")) category = "Ops";
            if (msg.includes("lost") || msg.includes("stolen") || msg.includes("block") || msg.includes("freeze")) category = "Risk";
            if (msg.includes("balance") || msg.includes("money") || msg.includes("total") || msg.includes("usdt")) category = "Balance";
        }

        let data;
        
        // 🤝 Human-in-the-Loop (HITL) Check
        if (msg.includes("human") || msg.includes("agent") || msg.includes("person") || msg.includes("operator")) {
            data = {
                text: "Handing over to a RedotPay Human Specialist. Estimated wait time: 2 mins. (Context: " + (currentContext || "General") + ")",
                action: "HITL_ESCALATION"
            };
        } else if (category !== "UNK") {
            data = domainAgents[category](msg);
            // Update context based on agent action (e.g., if agent asks a question)
            if (data.action === "AUDIT_RECOVERY") currentContext = "AUDIT_RECOVERY";
            else currentContext = null;
        } else {
            data = {
                text: "I'm not sure about that. I can help with 'How to apply', 'Transaction status', 'Balance', or 'Card security'. Or type 'human' to talk to us.",
                action: "GREETING"
            };
        }

        // Remove typing indicator
        document.getElementById(typingId).remove();

        // Add bot message
        addLog("[RT] Intent matched: " + (data.action || "GREETING"), 'success');
        addMessage(data.text, 'bot');

        // Handle specific actions
        if (data.action === 'SECURITY_PROTOCOL') {
            addLog("[SEC] CRITICAL: Initiating card lockdown", 'info');
            triggerCardBlock();
        }
    }, 800);
}

function addLog(text, type) {
    const container = document.getElementById('log-container');
    if (!container) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = text;
    container.prepend(entry);
    container.scrollTop = 0; // Logs prepend, so scroll to top
}

function addMessage(text, type) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const div = document.createElement('div');
    const id = "msg-" + Date.now();
    div.id = id;
    div.className = `msg ${type}`;
    div.textContent = text;
    container.appendChild(div);
    
    // 🔥 FIX: Ensure scroll happens AFTER DOM update
    setTimeout(() => {
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
        });
    }, 50);
    
    return id;
}

function triggerCardBlock() {
    const overlay = document.getElementById('card-status-overlay');
    const text = document.getElementById('card-status-text');

    // Animate a "Blocking" effect
    text.textContent = "FREEZING...";
    text.className = "status-pill blocked pulse";

    setTimeout(() => {
        overlay.classList.remove('hidden');
        text.textContent = "SECURITY LOCK";
        text.classList.remove('pulse');
    }, 1500);
}
