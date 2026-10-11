# AGENTS.md — AirOps Copilot (GSD & CodeRabbit Protocol)

Welcome to **AirOps Copilot**, the next-generation AI Travel Agent Workspace and Operating System for Travel Management Companies (TMCs), inspired by ProDT OptimusX and Sabre GDS.

---

## 1. GSD (Get Shit Done) Operating Principles
Every agent working on this codebase must adhere strictly to GSD spec-driven workflows:
1. **Spec First**: Maintain strict domain models (`src/types/travel.ts`). Do not modify business logic without documenting the spec.
2. **Context Preservation**: Avoid monolithic files. Split components, domain utilities, and API routes cleanly.
3. **Atomic Execution**: Complete one feature slice at a time (Type -> Data -> Logic -> UI -> Verification).
4. **Zero-Configuration Invariant**: The application must run cleanly without any external API keys. Every service (Amadeus, LLM extraction) must have a realistic, high-fidelity mock fallback.
5. **Continuous Verification**: After writing code, run builds or tests to guarantee zero runtime regressions.

---

## 2. TravelTech Domain & Terminology Standards
Always preserve authentic GDS / TMC vocabulary:
- **IATA Codes**: 3-letter uppercase airport codes (`DEL`, `BOM`, `DXB`, `SIN`, `LHR`, `JFK`, `BLR`, `DOH`).
- **PNR (Passenger Name Record)**: Exactly 6 alphanumeric uppercase characters (e.g., `EK7P9X`, `AB3K9M`).
- **Fare Hierarchy**:
  - `Net Fare`: Airline wholesale cost.
  - `Markup / Margin`: Agency profit (Percentage or Flat).
  - `Gross Fare`: Final quoted client price (`Net + Markup`).
- **Fare Classes**: `Y` (Economy), `W` (Premium Economy), `J` (Business), `F` (First).
- **Segments**: Sequence of flight legs including operating airline, flight number, departure/arrival IATA, times, duration, baggage allowance.

---

## 3. Code Quality & CodeRabbit Standards
- Strict TypeScript with zero `any` types where possible.
- Accessible, responsive UI powered by Tailwind CSS and Lucide React.
- Run CodeRabbit reviews on modified git diffs prior to finalizing PRs.
