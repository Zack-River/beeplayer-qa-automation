# 05 — Risk Register & Safety Requirements

**Phase:** Phase 4 (Risk Analysis + Safety Requirement Definition)
**Date:** 2026-08-31

This document identifies runtime risks based on the API inventory and workflow discovery, and explicitly defines the Safety Requirements (SR) that the automation framework must implement to mitigate them.

> **Note:** This phase defines requirements only. Implementation of the safety gates occurs in Phase 8, and enforcement begins in Phase 9.

---

## Safety Requirement Definitions

### SR-01: FUNCTIONAL PRODUCTION GATE
If the target environment is production, execution must be gated by a valid authorization document per the Production Authorization Model.
- **Validation checks:** 
  1. File exists (`docs/execution/production-authorization.md`)
  2. `type: functional-production` matches.
  3. `target_url` matches the runtime base URL.
  4. `expires_at` is in the future.
  5. `test_accounts_confirmed_disposable` is exactly `true`.
- **Enforcement:** Any execution against production (including unauthenticated smoke/health checks) requires SR-01. If validation fails, block Phase 9+ execution entirely with a specific failure reason.

### SR-02: LOAD PRODUCTION GATE
If the target environment is production and the execution is a load test, a separate load authorization document is required.
- **Validation checks:**
  1. File exists (`docs/execution/load-production-approval.md`)
  2. All checks from SR-01.
  3. `load_testing_authorized` is exactly `true`.
- **Enforcement:** SR-01 must also be cleared (SR-02 does not substitute for SR-01). Without a valid SR-02 document, block Phase 12+ execution entirely.

### SR-03: LOAD SAFETY CLASSIFICATION
Certain classes of endpoints are too dangerous to subject to concurrent load without extreme safeguards.
- **Rules:** Any endpoint classified as `DESTRUCTIVE`, `LOAD_RESTRICTED`, `EXTERNAL_SIDE_EFFECT`, or `UNKNOWN` must be excluded from load scenarios.
- `DESTRUCTIVE` endpoints are permanently prohibited from load testing regardless of environment.
- `LOAD_RESTRICTED`, `EXTERNAL_SIDE_EFFECT`, and `UNKNOWN` endpoints may be reclassified for load testing ONLY through documented evidence and safety review, recorded explicitly in the Evidence Ledger.
- `UNKNOWN` is considered unsafe by default.

### SR-04: CREDENTIAL VALIDATION
Production testing poses the risk of corrupting real user accounts if non-disposable credentials are used.
- **Rule:** Disposable test account status must be confirmed in the authorization document (`test_accounts_confirmed_disposable: true`).
- **Enforcement:** If not explicitly confirmed, block execution.

### SR-05: CLEANUP PROTECTION
Functional automation that mutates state will pollute the environment if left unchecked, leading to brittle tests and data bloat.
- **Rule:** Every test that creates or mutates a resource must register cleanup before execution.
- Cleanup must run regardless of the test outcome (pass or fail).
- Cleanup failure is a distinct, reportable result (`CLEANUP_FAILURE` written to the execution log and defect log).
- If the workload is entirely read-only, it must be documented as "No cleanup required — read-only workload."

---

## Risk Register Highlights

| Risk | Priority | Mitigation | Description |
|------|----------|------------|-------------|
| Testing against production | CRITICAL | **SR-01, SR-02** | Hard authorization gates blocking execution without valid, unexpired YAML approval docs. |
| Real user credentials used | CRITICAL | **SR-04** | Credential confirmation required explicitly in the YAML approval docs. |
| DELETE endpoints in load | CRITICAL | **SR-03** | Blocked strictly by API classification (`DESTRUCTIVE`). |
| Financial endpoints in load | HIGH | **SR-03** | Blocked strictly by API classification (`EXTERNAL_SIDE_EFFECT` / `LOAD_RESTRICTED`). |
| Data collision between VUs | HIGH | **SR-05** | Enforced cleanup protection; unique prefix per VU (to be implemented in framework). |
| Cleanup failure | HIGH | **SR-05** | Cleanup-failure is a first-class reported result, preventing silent environment pollution. |
| Token expiry mid-test | MEDIUM | — | Phase 1 identified 0 refresh endpoints; token expiry requires complete re-auth handled at framework level. |
| Rate limiting at 20 VUs | MEDIUM | — | Monitor HTTP 429s; must include in load test abort criteria (Phase 12). |
