# AirOps Copilot ✈️
> **AI-Powered Travel Agent Workspace & Operating System for TMCs**  
> *Directly inspired by ProDT OptimusX and Sabre GDS Workflows.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![GSD Ready](https://img.shields.io/badge/GSD-Framework-emerald)](https://github.com/open-gsd)
[![CodeRabbit](https://img.shields.io/badge/CodeRabbit-Configured-ff6b6b)](https://coderabbit.ai)

---

## 🌟 Overview & Domain Architecture
**AirOps Copilot** is a B2B SaaS platform engineered for Travel Management Companies (TMCs) and flight ticketing desks. It bridges the gap between messy customer communications (WhatsApp messages, corporate emails) and complex Global Distribution Systems (Sabre, Amadeus, NDC).

### Core Capabilities:
1. **Unstructured Ingestion to Strict IATA Parameters**:
   - Parses noisy natural language inquiries into IATA airport codes (`BOM`, `DXB`, `DEL`, `SIN`, `LHR`), calendar dates, cabin classes (`Y`, `W`, `J`, `F`), passenger counts, and special meal/seat requests.
2. **Wholesale GDS Aggregation**:
   - Live query interface with Amadeus Self-Service API + zero-config high-fidelity mock fallback.
3. **Dynamic Markup & Margin Engine**:
   - Real-time calculation of **Airline Net Fare + Agency Margin (Percentage or Flat) = Gross Client Fare**.
4. **Instant Multi-Channel Proposal Dispatch**:
   - 1-click formatted proposals for **WhatsApp**, **Corporate Email**, and **Monospace Sabre/Amadeus GDS** cryptic PNR lines.
5. **PNR Ledger & Agent Line of Credit**:
   - Full audit trail of issued tickets, gross turnover, margin earned, and agent wallet credit.

---

## 🛠️ Built-in GSD & CodeRabbit Integrations
This project was scaffolded with both **GSD (Get Shit Done)** and **CodeRabbit** integrated from day one:
* **GSD Protocol (`AGENTS.md` & `.agents/rules/AGENTS.md`)**: Specifies spec-driven workflows, atomic task execution, and zero-context-rot standards.
* **GSD State Tracking (`.gsd/roadmap.md`, `.gsd/current_task.md`)**: Tracks feature roadmap and active phase.
* **CodeRabbit Configuration (`.coderabbit.yaml`)**: Assertive code review configuration tailored for TravelTech invariants and Next.js/Tailwind code quality.
* **CodeRabbit Antigravity Skill (`.agents/skills/coderabbit/SKILL.md`)**: Reusable runbook for running automated diff reviews directly within Antigravity.
* **VS Code Extensions (`.vscode/extensions.json`)**: Recommends `coderabbit.coderabbit-vscode` and `fluxlabs.gsd-2`.

---

## 🚀 Quick Start (Zero-Configuration)

No API keys required to test the full application!

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

### Optional Environment Variables (`.env.local`)
To connect live Amadeus or LLM APIs:
```env
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

---

## 🖥️ Screen Guide
- **`/workspace`**: The Agent Copilot Workspace — 3-panel layout with inbound prompt box, 3 sample chips, extracted IATA tag cloud, flight result cards, and dynamic markup console.
- **`/bookings`**: Bookings & Activity Ledger — PNR status tracking, wholesale margins, and corporate billing ledger.
