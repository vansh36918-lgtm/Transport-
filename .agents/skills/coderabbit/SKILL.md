---
name: coderabbit
description: Review code changes using CodeRabbit standards, inspect git diffs, ensure travel domain invariants, and run quality checks before finalizing.
---

# CodeRabbit Quality Gate Skill

## Objective
Provide automated, rigorous code reviews for AirOps Copilot using CodeRabbit guidelines.

## Review Checklist
1. **TravelTech Domain Consistency**:
   - Check IATA 3-letter uppercase format.
   - Verify PNR alphanumeric 6-character uppercase standard.
   - Validate Net Fare + Markup = Gross Fare calculations across all currency formats.
2. **Zero-Configuration Fallback Check**:
   - Verify all API endpoints (`/api/extract`, `/api/flights/search`, `/api/bookings`) function gracefully without `.env.local` credentials.
3. **UX & Performance**:
   - Ensure clean loading states (skeletons / spinners).
   - Ensure copy-to-clipboard functionality gives immediate visual feedback.
   - Confirm modal escapes and backdrop closures work smoothly.
