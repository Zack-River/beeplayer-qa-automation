# 11 — Traceability Matrix

**Phase:** Phase 5 (Test Strategy + Design)  
**Date:** 2026-08-31

This matrix ensures every risk and API requirement maps to a verified test or constraint.

| Requirement/Risk | Scenario | Test Case | Target Framework | Verification Method |
|------------------|----------|-----------|------------------|---------------------|
| SR-01 Production Gate | Pre-flight | N/A | Framework Boot | Reads YAML before test start |
| SR-03 Load Safety | Load Models | N/A | k6 Runner | Fails if DESTRUCTIVE URL found |
| Health Checks | SCN-F-01 | TC-F-01 | Playwright | Assert 200 + Contract |
| Admin Authentication | SCN-F-02 | TC-F-02 | Playwright | Assert Token Extracted |
| State Isolation | SCN-W-01 | TC-W-01 | Playwright | Verify unique data creation |
| Cleanup Enforcement | SR-05 | All Mutating | Playwright | After-All Hooks |
| Concurrent Load | Scenario A,B,C | N/A | k6 | Validate latency & 429 count |
