# 08 — Test Design

**Phase:** Phase 5 (Test Strategy + Design)  
**Date:** 2026-08-31

## 1. Contract Strength Decisions
Contract definitions will be categorized per the execution manual:
- **DOCUMENTED:** Base assumption if OpenAPI spec exists (currently N/A).
- **ASSERTED:** If Postman scripts assert a field, it is classified as `OBSERVED CONTRACT`.
- **OBSERVED:** Fields merely present in responses are `OBSERVED CONTRACT` unless explicit evidence dictates they are required.
- **REQUIRED CONTRACT:** A field that must be present (e.g., token). Absence results in a `PRODUCT_FAILURE`.

## 2. Design Techniques
- **Boundary Value & Equivalence:** For pagination and rate limits.
- **State Transition Testing:** For Ticket Lifecycles and Reseller Lifecycles.
- **Dependency Injection:** Auth tokens and dynamic IDs (e.g., `customerId`) will be explicitly injected into contexts to preserve isolation between VUs.
- **Negative Testing:** Unauthenticated access, invalid tokens, missing required fields.

## 3. Automation Abstractions
- **Normalizer:** The Postman collection will be parsed into an intermediate JSON format (`normalized-api.json`).
- **Executors:** Framework-agnostic executors will consume the normalized JSON to construct real HTTP requests in Playwright or k6.
