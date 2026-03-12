// Mock Data (matches backend for consistency)
const transactions = [
    { id: "TXN_002", amount: 120.00, currency: "USD", status: "DECLINED", description: "Apple Store Online", date: "Today, 10:00 AM", icon: "🍏", reason: "Insufficient Funds" },
    { id: "TXN_001", amount: 15.50, currency: "USD", status: "COMPLETED", description: "Starbucks Hong Kong", date: "Yesterday, 2:20 PM", icon: "☕" },
    { id: "TXN_003", amount: 200.00, currency: "USDT", status: "COMPLETED", description: "Deposit from Binance", date: "Today, 9:30 AM", icon: "🪙" }
];

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

async function handleUserInput() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    // Show typing indicator
    const typingId = addMessage("Analyzing intent...", 'bot typing');
    addLog("[NLP] Input detected: " + text, 'info');

    try {
        const response = await fetch('/api/agent/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();

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

    } catch (err) {
        console.error(err);
        addLog("[ERR] Router failure", 'info');
        document.getElementById(typingId).textContent = "Oops! Connection audit failed. Please try again.";
    }
}

function addLog(text, type) {
    const container = document.getElementById('log-container');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = text;
    container.prepend(entry);
}

function addMessage(text, type) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    const id = "msg-" + Date.now();
    div.id = id;
    div.className = `msg ${type}`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
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
