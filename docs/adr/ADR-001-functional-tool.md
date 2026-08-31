# ADR-001 — Functional API Testing Tool

**Date:** 2026-08-31  
**Status:** Approved (Phase 6)  

## Context
We need a robust functional API testing framework to orchestrate tests against the 132 endpoints of the BeePlayer API. The framework must support explicit state isolation for concurrent workflow execution, strict TypeScript typing, and complex setup/teardown hooks (specifically for SR-05 Cleanup Protection).

## Candidates Evaluated
1. **Playwright + TypeScript:** Native `APIRequestContext`, excellent CI reporting, strong fixture isolation.
2. **Jest / Supertest:** Traditional API testing stack, but requires manual state isolation management.
3. **Postman / Newman:** Legacy execution engine. Rejected because we cannot enforce strict CI safety gates (SR-01) or granular VU isolation easily without complex wrapper scripts.

## Decision
**Playwright + TypeScript** is selected as the functional, contract, and workflow execution engine.

## Justification
- `APIRequestContext` does not require a browser, making it fast and lightweight for API-only automation.
- Playwright's fixture system natively supports the Virtual User isolation required by our Test Data Strategy.
- TypeScript enables strict contract validation models derived from the normalized JSON API blueprint.

## Consequences
- We must explicitly rewrite Postman script semantics (like token extraction) into Playwright setup fixtures (which was already planned per Phase 1 findings).
