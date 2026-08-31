# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: functional/reseller.spec.ts >> Functional Tests - Resellers (SCN-F-03) >> POST /resellers creates a reseller (SR-05 enforced)
- Location: tests/functional/reseller.spec.ts:28:7

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
  7  | test.describe('Functional Tests - Resellers (SCN-F-03)', () => {
  8  |   const targetUrl = process.env.BASE_URL || 'https://api.beeplayer1.com';
  9  |   const rootDir = path.resolve(__dirname, '../../');
  10 |   
  11 |   let adminAuth: AuthContext;
  12 |   let cleanupManager: CleanupManager;
  13 | 
  14 |   test.beforeAll(async ({ request }) => {
  15 |     SafetyGate.enforceFunctionalProduction(targetUrl, rootDir);
  16 |     adminAuth = await AuthManager.loginAdmin(request, targetUrl);
  17 |   });
  18 | 
  19 |   test.beforeEach(() => {
  20 |     cleanupManager = new CleanupManager();
  21 |   });
  22 | 
  23 |   test.afterEach(async ({ request }) => {
  24 |     const result = await cleanupManager.executeAll(request);
  25 |     expect(result.errors).toHaveLength(0); // Fails the test if cleanup fails
  26 |   });
  27 | 
  28 |   test('POST /resellers creates a reseller (SR-05 enforced)', async ({ request }) => {
  29 |     const dynamicEmail = `qa_auto_${Date.now()}@beeplayer.com`;
  30 |     const response = await request.post(`${targetUrl}/resellers`, {
  31 |       headers: { 'Authorization': `Bearer ${adminAuth.token}` },
  32 |       data: {
  33 |         name: 'QA Auto Reseller',
  34 |         email: dynamicEmail,
  35 |         password: 'password123',
  36 |         status: 1
  37 |       }
  38 |     });
  39 |     
  40 |     // Note: Adjusting for potential API response patterns based on Postman behavior
  41 |     // If it fails with 404 or other due to missing fields, we log it.
  42 |     // Assuming 200/201 based on typical CRUD
> 43 |     expect(response.ok()).toBeTruthy();
     |                           ^ Error: expect(received).toBeTruthy()
  44 |     const data = await response.json();
  45 |     
  46 |     // Extract ID (handling both flat and nested responses)
  47 |     const resellerId = data.id || (data.data && data.data.id);
  48 |     expect(resellerId).toBeDefined();
  49 | 
  50 |     // Register cleanup (SR-05)
  51 |     cleanupManager.register({
  52 |       method: 'DELETE',
  53 |       url: `${targetUrl}/resellers/${resellerId}`,
  54 |       token: adminAuth.token,
  55 |       description: `Delete reseller ${resellerId}`
  56 |     });
  57 |   });
  58 | 
  59 |   test('GET /resellers returns list of resellers', async ({ request }) => {
  60 |     const response = await request.get(`${targetUrl}/resellers`, {
  61 |       headers: { 'Authorization': `Bearer ${adminAuth.token}` }
  62 |     });
  63 |     expect(response.ok()).toBeTruthy();
  64 |     const data = await response.json();
  65 |     // Validate contract structure (Array or paginated object)
  66 |     expect(typeof data === 'object').toBeTruthy();
  67 |   });
  68 | });
  69 | 
```