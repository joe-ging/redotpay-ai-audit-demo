# 🏗️ RedotPay AI-Audit: Prototype vs. Production Guide

> [!IMPORTANT]
> **Technical Interview Quick-Ref (CTO/CEO Deep-Dive)**
> 
> **Q: Is the Intent Routing asynchronous?**
> *   **Answer**: Yes. In this prototype, we use an asynchronous `setTimeout` (frontend) or `async/await` (server) to simulate AI thinking. In production, this would be a full **Event-Driven Architecture**. The UI updates immediately with a "Thinking/Analyzing" state while the Agentic router processes the logic in the background to ensure no blocking of the main thread.
> 
> **Q: Why Fuzzy Matching instead of a Vector Database (VDB) for this Demo?**
> *   **Answer**: Speed and precision for fixed intents. For a 1.0 prototype, regular expressions and keyword matching (Deterministic Routing) guarantee 100% accuracy for critical actions like "Card Lock". We've documented the transition to **Semantic Vector Search (RAG)** in Section 1 below for handling more ambiguous natural language in production.
> 
> **Q: What is the underlying mechanism (Track 3)?**
> *   **Answer**: It's a **Wrapper-Knowledge-Agentic (WKA)** architecture. The "Wrapper" is the UI/UX, the "Knowledge" is our mock transaction store, and the "Agentic" part is the Router that intelligently hands off requests to specialized Domain Agents (FAQ, Risk, Ops).

---

This document outlines the technical gap between this **v1 Prototype** and the **Enterprise-Grade Solution** suitable for RedotPay's 5M users.

---

## 🛰️ 1. Intent Routing & Memory
| Feature | Current Prototype | Production Solution |
| :--- | :--- | :--- |
| **Routing Mechanism** | **Keyword-based / Regex**. High speed but low flexibility. | **Vector Embeddings (Semantic Search)**. Using `text-embedding-3-small` stored in **Pinecone** or **Milvus** to understand intent even with typos or slang. |
| **Logic Layer** | `if/else` logic in `server.js`. | **LLM-Based Classifier**. A small model (like GPT-4o-mini) acts as the router to decide which sub-agent handles the ticket. |
| **Memory** | Resets on page refresh. | **Redis-backed Long-Term Memory**. Remembers "Jing lost her card 2 days ago" even when the user re-opens the app a week later. |

## 📁 2. Data & Knowledge Base
| Feature | Current Prototype | Production Solution |
| :--- | :--- | :--- |
| **Knowledge Base** | Fixed scripts in `domainAgents`. | **RAG (Retrieval-Augmented Generation)**. Dynamically crawls RedotPay's internal confluence/documentation to answer new policy questions without re-coding. |
| **Backend Integration** | Mock JSON data in `/services`. | **PostgreSQL / MongoDB**. Real-time read/write via RedotPay's core API with full transaction ledger consistency. |

## 🛡️ 3. Security & Compliance
| Feature | Current Prototype | Production Solution |
| :--- | :--- | :--- |
| **Authentication** | None (Public access). | **JWT + OAuth2**. Full bank-level authentication to ensure the AI only sees data authorized for that specific user. |
| **PII Data Handling** | Visible in console. | **PII Masking Layer**. A middleware that scrubs Card Numbers (PAN) and CVVs before sending text to external LLM providers (OpenAI/Claude). |
| **Risk Trigger** | Simulated `SECURITY_PROTOCOL`. | **Webhooks / Smart Contracts**. Direct integration with card issuer processors to freeze cards in <50ms upon AI-detected fraud. |

## 📊 4. Performance & Scalability
| Feature | Current Prototype | Production Solution |
| :--- | :--- | :--- |
| **Architecture** | Single-threaded Node.js server. | **Asynchronous Microservices**. Using Go/Rust for high-concurrency payment hooks, and Python for the Agentic orchestration layer. |
| **Concurrency** | Limited by local machine. | **Kubernetes Auto-scaling**. Dynamically spins up new Agent instances during peak promotional campaigns (e.g., Binance-RedotPay card drops). |

---

### 🚀 Roadmap Recommendation
1. **Phased Integration**: Don't replace the whole system. Start by replacing the `FAQ` layer with a RAG-based Vector DB (Pinecone).
2. **"Agent-on-Call"**: Use this prototype's **Heartbeat Mechanism** to manage state, ensuring a 99.9% uptime for the AI layer during high-traffic events.

*Document prepared by Margot (Jing Zhou) for the RedotPay CTO / Engineering Team.*
