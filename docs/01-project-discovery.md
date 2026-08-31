# 01 — Project Discovery & Forensics

**Phase:** Phase 1 (Postman Collection Forensics)
**Date:** 2026-08-31

This document summarizes the forensic analysis of the Postman source collection as required by Phase 1 of the implementation plan.

---

## 1. Scope & Scale
- **Collection Name:** BeePlayer API — Production
- **Total Requests:** 132 *(Note: Baseline documentation cited 130; 2 additional endpoints were found)*
- **Total Folders:** 20
- **Scope Freeze Hash (SHA-256):** `d10909316d2ea900801dfc8bc8affd09a99e3ab406ec4e3656ea936a52c779bf`

## 2. Authentication & Principals
Four distinct authentication endpoints were discovered:
1. `POST /auth/login` (Admin)
2. `POST /auth/login` (Reseller)
3. `POST /auth/customer/login` (Customer: MAC + key)
4. `POST /auth/customer/login` (Customer: username + password)

### Token Extraction Logic
The Postman test scripts for all four login endpoints use the exact same logic to locate the token:
```javascript
const json = pm.response.json();
const token = json.access_token || json.token || (json.data && json.data.access_token);
```
**Conclusion:** The token response structure is potentially inconsistent (it could be at the root, under `access_token`, or under `data.access_token`). The automation framework must implement this exact resilient fallback logic.

### Variable Mutation
The test scripts mutate the Postman environment heavily:
- Admin login sets `token` and `adminToken`.
- Reseller login sets `token` and `resellerToken`.
- Customer logins set `token` and `customerToken`.

**Action Item:** Postman's `pm.collectionVariables.set` does not exist in Playwright/k6. The new framework must establish a clear token storage and injection strategy (e.g., using `StorageState` in Playwright or context variables in k6).

## 3. Token Lifecycle (Refresh Mechanism)
- **Finding:** A forensic search of all 132 endpoint names and URLs for the word "refresh" yielded **0 results**.
- **Conclusion:** There is no dedicated token refresh endpoint. The automation framework does not need to handle automatic token refresh logic; if a token expires, the framework must perform a full re-authentication.

## 4. Pre-Request Scripts
- **Finding:** Across all 132 requests, there are **0 pre-request scripts**.
- **Conclusion:** There are no complex cryptographic signatures, dynamic HMAC generation, or pre-flight data transformations required to execute these requests.

## 5. Next Steps
The raw list of all 132 requests has been successfully extracted. Proceeding to Phase 2, this list will be classified for safety (`SAFE`, `DESTRUCTIVE`, etc.) to drive the overall automation strategy.
