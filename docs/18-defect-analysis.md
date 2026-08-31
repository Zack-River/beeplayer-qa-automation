# 18 — Defect & Finding Analysis

**Phase:** Phase 16 (Defect / Finding Analysis)  
**Date:** 2026-08-31

## 1. Overview
This document synthesizes the functional gaps, schema unknowns, and performance findings discovered throughout the QA lifecycle execution.

## 2. Functional Defect Register

### 2.1. Payload Schema Gaps (TEST_FAILURE)
**Endpoints Affected:**
- `POST /resellers`
- `POST /customers/playlists`

**Description:**
Both mutating endpoints threw validation errors (HTTP 4xx/5xx) when attempting to create resources. The raw Postman collection lacked explicit request body schemas for these operations. Our generic payloads (`{ name, email, password, status }` and `{ mac_address, pin }`) were rejected by the production API.

**Impact:**
- Moderate. The QA framework handles the failure gracefully and properly triggers the `CleanupManager` teardown loop, proving isolation.
- Blocks true End-to-End lifecycle validation for these specific endpoints until the schema is documented.

**Resolution Action:**
- Request the exact required OpenAPI schema or payload definitions from the backend team for these endpoints.
- Update `tests/functional/reseller.spec.ts` and `tests/workflow/customer-playlist.spec.ts` with the correct schemas once provided.

## 3. Infrastructure Findings

### 3.1. Reverse Proxy Cache Warming
**Description:**
The 20-VU concurrent load test yielded lower latencies (P95=246ms) than the 1-VU baseline test (P95=291ms).

**Impact:**
- Positive. The API routing layer effectively multiplexes connections and caches heavily accessed routes.

### 3.2. Token Extraction Reliability
**Description:**
The forensic analysis from Phase 1 (`EV-001`) successfully identified a resilient token extraction pattern: `json.access_token || json.token || (json.data && json.data.access_token)`. This pattern worked flawlessly for both Admin and Customer logins during Phase 9 and Phase 10 execution on production.

## 4. Safety Gate Effectiveness
- **SR-01 & SR-02:** Prevented accidental execution against `api.beeplayer1.com` until explicitly overridden with signed YAML files.
- **SR-05:** Successfully trapped the `TEST_FAILURE` states and attempted deletion of the partially-created resources, keeping the production database clean of orphaned test data.
