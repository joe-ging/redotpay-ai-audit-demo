# 🏗️ RedotPay AI-Audit: Prototype vs. Production Guide

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
