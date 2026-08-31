# 09 — Test Scenarios

**Phase:** Phase 5 (Test Strategy + Design)  
**Date:** 2026-08-31

This document maps the API inventory and workflows to logical test scenarios.

## 1. Functional Scenarios (Derived from Inventory)
- **SCN-F-01:** Health & Diagnostics standard response structural integrity.
- **SCN-F-02:** Authentication endpoints return correct tokens for valid credentials.
- **SCN-F-03:** Reseller CRUD operations enforce authorization and mutate state properly.
- **SCN-F-04:** Customer CRUD operations enforce authorization and mutate state properly.
- **SCN-F-05:** Playlist CRUD operations function correctly.

## 2. Workflow Scenarios (Derived from CWF)
- **SCN-W-01:** Reseller Onboarding (Create Reseller → Auth → Add Credit).
- **SCN-W-02:** Customer Onboarding (Create Customer → Create Playlist → Verify).
- **SCN-W-03:** Support Resolution (Create Ticket → Respond → Close).

## 3. Performance Scenarios (Derived from Load Model)
- **Scenario A (Customer Browse):** Auth → Profile → Playlists → Categories → Channels.
- **Scenario B (Customer VOD):** Auth → Profile → Playlists → VOD Categories → Stream Metadata.
- **Scenario C (Reseller Admin):** Auth → Profile → List Customers → Get Stats.
