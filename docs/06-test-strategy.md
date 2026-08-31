# 06 — Test Strategy

**Phase:** Phase 5 (Test Strategy + Design)  
**Date:** 2026-08-31

## 1. Scope
- **In Scope:** Functional testing, contract testing, and performance testing of the 132 endpoints identified in Phase 1 and classified in Phase 2.
- **Out of Scope:** UI testing, third-party payment gateway integration testing, external database testing, legacy endpoints (`ALIAS_SKIP`).

## 2. Test Types
1. **Smoke Tests:** Minimal tests to verify environment health and authentication.
2. **Functional Tests:** Endpoint-specific tests validating status codes and required fields.
3. **Contract Tests:** Strict validation of response payload schemas based on the Contract Strength Classification (REQUIRED vs OBSERVED).
4. **Workflow Tests:** End-to-end tests orchestrated from the Candidate Workflows (e.g. Create Reseller → Login → Buy Credit).
5. **Baseline Performance Tests:** Single-user load test (1 VU) to establish a baseline for cold/steady-state latency.
6. **Concurrent Load Tests:** 20-VU load test modelling the synthetic distribution of Scenarios A, B, and C.

## 3. Data Strategy
- Tests will not rely on hardcoded IDs where possible.
- State mutation operations (POST/PUT/PATCH) will employ dynamic test data (e.g., `test_reseller_{uuid}`).
- Every test performing mutation must register a cleanup handler.

## 4. Entry and Exit Criteria
**Entry Criteria:**
- Approval docs (SR-01, SR-02) exist for production execution.
- Baseline infrastructure and environment variables exist.

**Exit Criteria:**
- 100% of defined `DEDICATED_TEST` endpoints functionally verified.
- 100% of defined Workflows functionally verified.
- 1-VU Baseline and 20-VU Load Tests successfully completed without triggering abort criteria.
- No critical/high test failures. All failures accurately classified per taxonomy.
