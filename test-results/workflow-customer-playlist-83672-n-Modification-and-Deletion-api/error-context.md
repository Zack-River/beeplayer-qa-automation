# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow/customer-playlist.spec.ts >> Workflow Tests - Playlist Lifecycle (SCN-W-02 / CWF-07) >> TC-W-02: End-to-end Playlist Creation, Modification, and Deletion
- Location: tests/workflow/customer-playlist.spec.ts:29:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { SafetyGate } from '../../src/config/safety-gate';
  3  | import { AuthManager, AuthContext } from '../../src/core/auth-manager';
  4  | import { CleanupManager } from '../../src/core/cleanup-manager';
  5  | import * as path from 'path';
  6  | 
  7  | test.describe('Workflow Tests - Playlist Lifecycle (SCN-W-02 / CWF-07)', () => {
  8  |   const targetUrl = process.env.BASE_URL || 'https://api.beeplayer1.com';
  9  |   const rootDir = path.resolve(__dirname, '../../');
  10 |   
  11 |   let customerAuth: AuthContext;
  12 |   let cleanupManager: CleanupManager;
  13 | 
  14 |   test.beforeAll(async ({ request }) => {
  15 |     SafetyGate.enforceFunctionalProduction(targetUrl, rootDir);
  16 |     // Use the provided customer credentials
  17 |     customerAuth = await AuthManager.loginCustomer(request, targetUrl);
  18 |   });
  19 | 
  20 |   test.beforeEach(() => {
  21 |     cleanupManager = new CleanupManager();
  22 |   });
  23 | 
  24 |   test.afterEach(async ({ request }) => {
  25 |     const result = await cleanupManager.executeAll(request);
  26 |     expect(result.errors).toHaveLength(0); // Fails the test if cleanup fails
  27 |   });
  28 | 
  29 |   test('TC-W-02: End-to-end Playlist Creation, Modification, and Deletion', async ({ request }) => {
  30 |     const dynamicMac = `00:1A:2B:3C:${Math.floor(Math.random() * 90 + 10)}:${Math.floor(Math.random() * 90 + 10)}`;
  31 |     
  32 |     // Step 1: Create Playlist (POST /customers/playlists)
  33 |     const createResponse = await request.post(`${targetUrl}/customers/playlists`, {
  34 |       headers: { 'Authorization': `Bearer ${customerAuth.token}` },
  35 |       data: {
  36 |         mac_address: dynamicMac,
  37 |         pin: '1234'
  38 |       }
  39 |     });
  40 | 
  41 |     // Note: If we don't know the exact schema, this might 400. We log it as a TEST_FAILURE.
> 42 |     expect(createResponse.ok()).toBeTruthy();
     |                                 ^ Error: expect(received).toBeTruthy()
  43 |     const createData = await createResponse.json();
  44 |     
  45 |     // Extract ID (handling both flat and nested responses)
  46 |     const playlistId = createData.id || (createData.data && createData.data.id);
  47 |     expect(playlistId).toBeDefined();
  48 | 
  49 |     // Register cleanup (SR-05) immediately
  50 |     cleanupManager.register({
  51 |       method: 'DELETE',
  52 |       url: `${targetUrl}/customers/playlists/${playlistId}`,
  53 |       token: customerAuth.token,
  54 |       description: `Delete playlist ${playlistId}`
  55 |     });
  56 | 
  57 |     // Step 2: Modify Playlist (PUT /customers/playlists/{id})
  58 |     const updateResponse = await request.put(`${targetUrl}/customers/playlists/${playlistId}`, {
  59 |       headers: { 'Authorization': `Bearer ${customerAuth.token}` },
  60 |       data: {
  61 |         pin: '4321'
  62 |       }
  63 |     });
  64 |     expect(updateResponse.ok()).toBeTruthy();
  65 | 
  66 |     // Step 3: Cleanup will automatically run in afterEach, validating the DELETE endpoint.
  67 |   });
  68 | });
  69 | 
```