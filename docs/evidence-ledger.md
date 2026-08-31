# EVIDENCE LEDGER
**Initialized:** 2026-08-31T06:48:00+03:00

> **Purpose:** This ledger records all confirmed observations about the API contract and behaviors. Nothing is assumed; everything recorded here must be backed by evidence (e.g., Postman scripts, observed responses, documentation).

## Scope Control
```yaml
# EV-SCOPE-001
scope_freeze:
  collection_name: BeePlayer API — Production
  collection_sha256: d10909316d2ea900801dfc8bc8affd09a99e3ab406ec4e3656ea936a52c779bf
  collection_request_count: 132
  collection_folder_count: 20
  environment_name: BeePlayer — Production
  environment_sha256: 4ada4ff83bf563e64427e3f5c85eb0ca4a5e9dd689d07439e7b2ca1d119643a4
  captured_at: 2026-08-31T06:44:35+03:00
```

## Authentication & Tokens
- **EV-001:** Login — admin → token at: `json.access_token || json.token || (json.data && json.data.access_token)` `[CONFIRMED]`
- **EV-002:** Login — reseller → token at: `json.access_token || json.token || (json.data && json.data.access_token)` `[CONFIRMED]`
- **EV-003:** Login — customer (MAC + key) → token at: `json.access_token || json.token || (json.data && json.data.access_token)` `[CONFIRMED]`
- **EV-004:** Login — customer (username + password) → token at: `json.access_token || json.token || (json.data && json.data.access_token)` `[CONFIRMED]`
- **EV-005:** Token Refresh Mechanism → No "refresh" endpoint exists in the 132 requests. `[CONFIRMED]`

## Script Behaviors
- **EV-006:** Pre-request scripts → None found across all 132 requests. `[CONFIRMED]`
- **EV-007:** Custom token extraction logic → The Postman test scripts mutate environment variables `token`, `adminToken`, `resellerToken`, and `customerToken`. Playwright/k6 frameworks must explicitly reimplement this assignment. `[CONFIRMED]`
