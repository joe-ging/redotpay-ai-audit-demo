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
        
        // --- 🏗️ CONTEXT-AWARE ROUTING (State-of-the-art Matcher) ---
        
        // Match confirmations more loosely (not just anchors ^ and $)
        const isConfirm = /\b(yes|sure|ok|okay|yep|y|go ahead|proceed|do it|check|yeah|yup|fine)\b/i.test(msg);
        const isDeny = /\b(no|stop|nevermind|cancel|n|dont|wait|not now)\b/i.test(msg);

        console.log(`[AI Engine] Context: ${currentContext}, Input: "${msg}", IsConfirm: ${isConfirm}`);

        if (currentContext === "AUDIT_RECOVERY" && isConfirm) {
            category = "Balance";
        } 
        else if (currentContext === "AUDIT_RECOVERY" && isDeny) {
            addMessage("Understood. I've cancelled the audit. Anything else I can help with?", "bot");
            currentContext = null;
            document.getElementById(typingId).remove();
            return;
        }
        else {
            if (/\b(how|apply|get|physical|where|card|account)\b/i.test(msg)) category = "FAQ";
            if (/\b(why|decline|fail|status|transaction|audit|order|declined)\b/i.test(msg)) category = "Ops";
            if (/\b(lost|stolen|block|freeze|lock|security|lost card)\b/i.test(msg)) category = "Risk";
            if (/\b(balance|money|total|usdt|crypto|wallet|asset)\b/i.test(msg)) category = "Balance";
        }

        let data;
        
        // 🤝 Human-in-the-Loop (HITL) Check
        if (msg.includes("human") || msg.includes("agent") || msg.includes("person") || msg.includes("operator")) {
            data = {
                text: "Handing over to a RedotPay Human Specialist. Estimated wait time: 2 mins.",
                action: "HITL_ESCALATION"
            };
        } else if (category !== "UNK") {
            data = domainAgents[category](msg);
            // PERSIST CONTEXT if it's an audit
            if (data.action === "AUDIT_RECOVERY") {
                currentContext = "AUDIT_RECOVERY";
                addLog("[MEM] Saved Context: AUDIT_WAIT", 'info');
            } else {
                currentContext = null;
            }
        } else {
            data = {
                text: "I'm not sure about that. I can help with 'How to apply', 'Transaction status', 'Balance', or 'Card security'. Or type 'human' to talk to us.",
                action: "GREETING"
            };
            currentContext = null;
        }

        // Remove typing indicator
        document.getElementById(typingId).remove();

        // Add bot message
        addLog("[RT] Intent: " + (data.action || "GREETING") + (category !== "UNK" ? " (v1.0.3)" : ""), 'success');
        addMessage(data.text, 'bot');

        // Handle specific actions
        if (data.action === 'SECURITY_PROTOCOL') {
            addLog("[SEC] CRITICAL: Card Lockdown", 'info');
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
}

function addMessage(text, type) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    const div = document.createElement('div');
    const id = "msg-" + Math.random().toString(36).substring(7);
    div.id = id;
    div.className = `msg ${type}`;
    div.textContent = text;
    container.appendChild(div);
    
    // 🧱 BULLETPROOF SCROLLING
    const scrollBottom = () => {
        container.scrollTop = container.scrollHeight;
        div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    // Try immediately
    scrollBottom();
    
    // Try again after 50ms and 200ms to handle different browser rendering speeds
    setTimeout(scrollBottom, 50);
    setTimeout(scrollBottom, 200);
    
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
