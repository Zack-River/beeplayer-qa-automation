# 02 — Test Basis Analysis

**Phase:** Phase 1 (Postman Collection Forensics)
**Date:** 2026-08-31

This document assesses the quality, completeness, and reliability of the Postman collection as the primary test basis for automation, per Phase 1 of the implementation plan.

---

## 1. Quality of Source Evidence

### The Good
- **Comprehensive coverage:** 132 endpoints covering 20 functional domains is an extensive representation of the API surface.
- **Test Scripts:** Four authentication endpoints have clear token extraction assertions. Several other endpoints have `pm.test` or `pm.expect` scripts, providing strong initial contract evidence (ASSERTED).
- **Environment variables:** The `beeplayer-production.postman_environment.json` clearly documents the expected shape of dynamic data (e.g. `resellerEmail`, `customerMac`).

### The Gaps
- **Missing assertions:** The vast majority of the 132 requests have no test scripts (only 9 have test scripts: the 4 logins, plus some in Resellers/Playlists/Credit Packages). The contracts for the remaining ~123 endpoints must be INFERRED or OBSERVED during runtime execution.
- **No data setup/teardown:** There are no pre-request scripts anywhere in the collection to seed data. This means the tests currently rely on pre-existing data in the target environment (e.g., `{{resellerId}}`, `{{customerId}}`).

## 2. Technical Constraints Imposed by the Source

### 2.1 State Management is Manual
Postman collections often use request chaining (Request A extracts ID → Request B uses ID). Because there are no pre-request scripts, the IDs used in this collection (`{{resellerId}}`, `{{playlistId}}`, etc.) are either hardcoded in the environment or extracted in real-time by a human running requests in sequence. The automation framework will need to formally model these sequences as explicit **workflows** (Phase 3) rather than treating them as isolated unit tests.

### 2.2 Shared Environment Variables
The Postman scripts mutate a single global `token` variable, overriding it depending on who logged in last. Playwright and k6 must use strict isolation per-user (or per-VU) so that an Admin token does not accidentally overwrite a Reseller token in concurrent execution.

### 2.3 Postman-Specific Semantics
Any instances of `pm.environment.set` or `pm.expect` found in the collection are Postman-specific and cannot run directly in Playwright or k6. The framework must treat these scripts as documentation of intent, not executable code.

## 3. Verdict
The Postman collection is a solid, albeit highly manual, functional specification. It is suitable as the primary test basis, provided the automation framework explicitly handles data seeding, state isolation, and explicit workflow orchestration.
