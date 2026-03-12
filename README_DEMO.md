# 🛡️ RedotPay AI-Audit Demo: Agentic CX & Security Prototype

> **Objective**: Show RedotPay's CTO how a "Small Team" can handle 5 million users using AI-Native Intelligence.

---

## 🏗️ The Vision: WKA Architecture
This demo showcases the **Wrapper-Knowledge-Agentic (WKA)** architecture implemented on top of a standard Payment Backend.

1.  **Wrapper**: A lightweight REST API simulating RedotPay transactions.
2.  **Knowledge**: Local audit rules and real-time transaction data patterns.
3.  **Agentic**: An intelligent "Intent-First" router that doesn't just answer—it **acts** (e.g., initiating a card freeze).

---

## 🛠️ How to Perform the Live Demo

### Step 1: Start the Backend
```bash
node server.js
```
The server will run on `http://localhost:3001`.

### Step 2: Show the AI Agent in Action (Terminal Demo)
Run the following `curl` command to show how the Agent handles a sensitive security issue:

**Scenario: User lost their card**
```bash
curl -X POST http://localhost:3001/api/agent/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "I lost my card, help!"}'
```
**Expected Output**:
> `{"text":"🚨 SECURITY ALERT: I've initiated the card protection workflow...","action":"SECURITY_PROTOCOL","priority":"CRITICAL"}`

**Scenario: Troubleshooting a declined transaction**
```bash
curl -X POST http://localhost:3001/api/agent/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Why was my order declined?"}'
```
**Expected Output**:
> `{"text":"Agent Analysis: I've found a declined transaction at \"Apple Store Online\"... Code: \"Insufficient Funds\"...","action":"AUDIT_RECOVERY"}`

---

## 💎 The Pitch Points for the CTO
*   **10x Velocity**: "This prototype was built in 20 minutes using AI-Native R&D tools. In a production environment, this translates to daily deployments of core Agentic features."
*   **Scale Without Headcount**: "By building 'Intent-First' routers like this, your support team doesn't need to scale linearly with your user base. The AI handles the 80% of common queries using direct API-to-Agent connections."
*   **Compliance at the Edge**: "The agent can be programmed with HKMA/SFC regulatory rules, ensuring every response is legally sound before hitting the user."

---

## 📁 Repository Structure
*   `server.js`: The AI Engine & REST Framework.
*   `PROTOTYPE_VS_PRODUCTION.md`: **[NEW]** Gap analysis for the CTO on scaling to 5M users.
*   `public/index.html`: Optimized UI with Live AI Audit Logs.
*   `services/mock_data.js`: Simulated RedotPay card & transaction databases.
*   `test_agent.py`: Automated testing script (Python).

---
*Developed by Margot (Jing Zhou)*
