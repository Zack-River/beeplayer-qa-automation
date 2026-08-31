# 10 — Test Cases

**Phase:** Phase 5 (Test Strategy + Design)  
**Date:** 2026-08-31

This document outlines high-level test cases mapping to our scenarios. Detailed implementation lives in code.

## Smoke & Functional (DEDICATED_TEST)
- **TC-F-01:** `GET /` returns 200 OK and validates basic API health.
- **TC-F-02:** `POST /auth/login` (Admin) returns 200 OK and valid token.
- **TC-F-03:** `POST /auth/login` with invalid credentials returns 401 Unauthorized.
- **TC-F-04:** `GET /auth/me` with missing token returns 401 Unauthorized.
- **TC-F-05:** `GET /auth/me` with valid token returns user profile object.

## Workflow (CANDIDATE WORKFLOWS)
- **TC-W-01 (CWF-05):** Reseller CRUD Lifecycle.
  - Precondition: Valid Admin Token.
  - Step 1: `POST /resellers` (store ID).
  - Step 2: `GET /resellers/{id}` (verify existence).
  - Step 3: `PUT /resellers/{id}` (update name).
  - Step 4: `DELETE /resellers/{id}`.
  - Expected: 201 Created → 200 OK → 200 OK → 204 No Content.

- **TC-W-02 (CWF-07):** Playlist Lifecycle.
  - Precondition: Valid Customer Token.
  - Step 1: `POST /customers/playlists` (store playlist ID).
  - Step 2: `PUT /customers/playlists/{id}` (modify properties).
  - Step 3: `DELETE /customers/playlists/{id}`.
  - Expected: 201 Created → 200 OK → 204 No Content.

*(Note: The full permutation of test cases for all 132 endpoints is programmatically generated in the automation framework based on classification. This document outlines the core structural cases.)*
