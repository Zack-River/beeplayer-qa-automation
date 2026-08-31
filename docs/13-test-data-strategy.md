# 13 — Test Data Strategy

**Phase:** Phase 5 (Test Strategy + Design)  
**Date:** 2026-08-31

## 1. Virtual User (VU) Isolation
- Each Virtual User will maintain a strictly isolated context (cookies, headers, storage state).
- Tokens extracted by VU `A` must never be accessible to VU `B`.
- Context injection will occur explicitly rather than relying on global variables.

## 2. Dynamic Data Generation
- Hardcoded test data leads to collision (e.g., creating a reseller with email `test@test.com` fails on the 2nd run).
- We use unique prefixes: `QA_AUTO_{Timestamp}_{UUID}_Name`.

## 3. Cleanup Registration (SR-05 Enforcement)
- **Mechanism:** When a test creates a resource, it must register the deletion endpoint and ID in a central Cleanup Manager.
- **Execution:** The Cleanup Manager executes all registered deletions in the teardown phase (e.g., `afterAll` or `afterEach`).
- **Reporting:** If a cleanup call fails, the framework logs a `CLEANUP_FAILURE`.

## 4. Pre-seeded Data
Certain operations (e.g., buying a credit package) may require static IDs that are considered global configurations (`{{creditPackageId}}`). These will be fetched dynamically via a `GET` list endpoint during setup to avoid hardcoding IDs that might differ between environments.
