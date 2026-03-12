# 🛡️ RedotPay AI-Audit Demo: 智能客服与安全审计原型

> **项目目标**: 展示 RedotPay 的“小团队”如何利用 AI 原生智能 (AI-Native Intelligence) 支撑 500 万用户的服务与合规需求。

---

## 🚀 演示地址 (Live Demo)
**[点击访问实时在线演示](https://joe-ging.github.io/redotpay-ai-audit-demo/)**

---

## 🏗️ 核心架构：WKA 模型
本演示展示了在标准支付后端之上构建的 **Wrapper-Knowledge-Agentic (WKA)** 架构：

1.  **Wrapper (封装层)**: 一个轻量级的 REST API，模拟 RedotPay 真实的交易流程。
2.  **Knowledge (知识层)**: 本地审计规则库和实时交易数据模式感应。
3.  **Agentic (智能体层)**: “意图优先”的智能路由器。它不仅仅是回答问题，而是**直接触发行动**（例如：在检测到风险时自动触发锁卡流程）。

---

## 📈 原型与生产环境演进路线 (重点)

> [!NOTE]
> 以下内容提取自 [PROTOTYPE_VS_PRODUCTION.md](./PROTOTYPE_VS_PRODUCTION.md)，展示了该原型如何升级为企业级方案。

### 核心技术 FAQ
*   **意图路由是否异步？**: 是的。生产环境将演进为全异步的**事件驱动架构**，确保主线程永不阻塞。
*   **为什么不直接用向量数据库？**: 原型使用确定性正则路由以保证锁卡等操作的 **100% 确定性**；生产环境会引入 RAG/VDB 处理复杂长尾流量。
*   **WKA 架构核心**: 即使在小型研发团队中，也能通过智能 Agent 编排层实现对海量交易流的实时监控与资产保护。

| 演进方案 | 当前原型 (v1) | 生产级方案 (Production) |
| :--- | :--- | :--- |
| **路由决策** | 关键词/正则表达式匹配 | 语义向量搜索 (Embeddings) + LLM 分类器 |
| **内存持久化** | 内存存储，刷新重置 | Redis 支撑的长期对话记忆 |
| **安全脱敏** | 控制台逻辑处理 | PII 数据加密管道 (Masking Layer) |
| **负载伸缩** | 单机 Node.js | Kubernetes 弹性扩展 + Go/Rust 微服务 |

---

## 🛠️ 技术亮点
*   **意图感应与多轮对话**: 具备上下文记忆，能识别“sure”是对上一轮提议的确认。
*   **实时审计日志**: 左侧看板实时展示 AI 的决策链条。
*   **大厂级 App UI**: 采用 Flex Pillar 架构，支持窗口内滚动，适配移动端和桌面端。

---

## 📁 仓库结构
*   `PROTOTYPE_VS_PRODUCTION.md`: **[核心文档]** 详细的技术演进路线图。
*   `app.js`: 核心意图路由逻辑。
*   `index.html`: 高级黑卡主题 UI。
*   `README.md`: 本项目介绍。

---

## 👨‍💻 作者
**Margot (Jing Zhou)** - *Digital Asset Solution v1.0.7*
