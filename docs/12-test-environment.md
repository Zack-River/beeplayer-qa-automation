# 12 — Test Environment

**Phase:** Phase 5 (Test Strategy + Design)  
**Date:** 2026-08-31

## Target Environment Details
- **Base URL:** `https://api.beeplayer1.com`
- **Designation:** Production

## Environment Variables
The automation framework will require the following environment variables (seeded locally, not committed):
- `BASE_URL`: URL of the API.
- `ADMIN_EMAIL`: Required for Admin authentication.
- `ADMIN_PASSWORD`: Required for Admin authentication.
- `RESELLER_EMAIL`: Required for Reseller operations.
- `RESELLER_PASSWORD`: Required for Reseller operations.

## Constraints & Unknowns
- **Rate Limits:** Unknown. We will monitor HTTP 429 during load testing.
- **Resource Quotas:** Unknown. Creation limits (e.g., max playlists per customer) may block tests if state is not cleaned up.
- **Data Pruning:** Unknown if the backend prunes test data. We enforce client-side cleanup via SR-05.
