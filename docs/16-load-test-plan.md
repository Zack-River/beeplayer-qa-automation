# 16 — Load Test Plan

**Phase:** Phase 6 (Architecture Decisions + Final Scaffold)  
**Date:** 2026-08-31

## 1. Workload Definitions
The performance evaluation is split into two explicit runs.

### Run 1: 1-VU Baseline
- **Purpose:** Establish the un-contended latency profile of the API.
- **Duration:** 10 iterations per scenario.
- **VUs:** 1.
- **Measurement:** Cold-start latency (Iteration 1) vs Steady-state latency (Iterations 2-10).

### Run 2: 20-VU Concurrent Load
- **Purpose:** Evaluate API stability and response degradation under synthetic load.
- **Duration Profile:**
  - `ramp_up`: 60s (0 → 20 VUs)
  - `steady_state`: 10m (20 VUs)
  - `ramp_down`: 30s (20 → 0 VUs)
- **Workload Distribution (Synthetic):**
  - Scenario A (Customer Browse): 50% (10 VUs)
  - Scenario B (Customer VOD): 30% (6 VUs)
  - Scenario C (Reseller Admin): 20% (4 VUs)

## 2. Load Safety Enforcement (SR-02 & SR-03)
- The execution wrapper will first read `docs/execution/load-production-approval.md`. If invalid, `k6` will not be invoked.
- The `k6` script will read the `normalized-api.json`. If it encounters any endpoint flagged as `DESTRUCTIVE` or `EXTERNAL_SIDE_EFFECT` in its execution path, it will immediately throw an error and abort the VU.

## 3. Abort Criteria
The load test will be manually or automatically aborted if:
- Sustained HTTP 5xx error rate > 5%.
- Authentication failure spike (indicating account lockout or rate limiting on `/auth`).
- Environment instability or network connection resets.
- Unexpected destructive behavior observed.
