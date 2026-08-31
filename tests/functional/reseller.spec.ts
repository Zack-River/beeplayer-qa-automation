import { test, expect } from '@playwright/test';
import { SafetyGate } from '../../src/config/safety-gate';
import { AuthManager, AuthContext } from '../../src/core/auth-manager';
import { CleanupManager } from '../../src/core/cleanup-manager';
import * as path from 'path';

test.describe('Functional Tests - Resellers (SCN-F-03)', () => {
  const targetUrl = process.env.BASE_URL || 'https://api.beeplayer1.com';
  const rootDir = path.resolve(__dirname, '../../');
  
  let adminAuth: AuthContext;
  let cleanupManager: CleanupManager;

  test.beforeAll(async ({ request }) => {
    SafetyGate.enforceFunctionalProduction(targetUrl, rootDir);
    adminAuth = await AuthManager.loginAdmin(request, targetUrl);
  });

  test.beforeEach(() => {
    cleanupManager = new CleanupManager();
  });

  test.afterEach(async ({ request }) => {
    const result = await cleanupManager.executeAll(request);
    expect(result.errors).toHaveLength(0); // Fails the test if cleanup fails
  });

  test('POST /resellers creates a reseller (SR-05 enforced)', async ({ request }) => {
    const dynamicEmail = `qa_auto_${Date.now()}@beeplayer.com`;
    const response = await request.post(`${targetUrl}/resellers`, {
      headers: { 'Authorization': `Bearer ${adminAuth.token}` },
      data: {
        name: 'QA Auto Reseller',
        email: dynamicEmail,
        password: 'password123',
        status: 1
      }
    });
    
    // Note: Adjusting for potential API response patterns based on Postman behavior
    // If it fails with 404 or other due to missing fields, we log it.
    // Assuming 200/201 based on typical CRUD
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    // Extract ID (handling both flat and nested responses)
    const resellerId = data.id || (data.data && data.data.id);
    expect(resellerId).toBeDefined();

    // Register cleanup (SR-05)
    cleanupManager.register({
      method: 'DELETE',
      url: `${targetUrl}/resellers/${resellerId}`,
      token: adminAuth.token,
      description: `Delete reseller ${resellerId}`
    });
  });

  test('GET /resellers returns list of resellers', async ({ request }) => {
    const response = await request.get(`${targetUrl}/resellers`, {
      headers: { 'Authorization': `Bearer ${adminAuth.token}` }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    // Validate contract structure (Array or paginated object)
    expect(typeof data === 'object').toBeTruthy();
  });
});
