import { test, expect } from '@playwright/test';
import { SafetyGate } from '../../src/config/safety-gate';
import { AuthManager, AuthContext } from '../../src/core/auth-manager';
import { CleanupManager } from '../../src/core/cleanup-manager';
import * as path from 'path';

test.describe('Workflow Tests - Playlist Lifecycle (SCN-W-02 / CWF-07)', () => {
  const targetUrl = process.env.BASE_URL || 'https://api.beeplayer1.com';
  const rootDir = path.resolve(__dirname, '../../');
  
  let customerAuth: AuthContext;
  let cleanupManager: CleanupManager;

  test.beforeAll(async ({ request }) => {
    SafetyGate.enforceFunctionalProduction(targetUrl, rootDir);
    // Use the provided customer credentials
    customerAuth = await AuthManager.loginCustomer(request, targetUrl);
  });

  test.beforeEach(() => {
    cleanupManager = new CleanupManager();
  });

  test.afterEach(async ({ request }) => {
    const result = await cleanupManager.executeAll(request);
    expect(result.errors).toHaveLength(0); // Fails the test if cleanup fails
  });

  test('TC-W-02: End-to-end Playlist Creation, Modification, and Deletion', async ({ request }) => {
    const dynamicMac = `00:1A:2B:3C:${Math.floor(Math.random() * 90 + 10)}:${Math.floor(Math.random() * 90 + 10)}`;
    
    // Step 1: Create Playlist (POST /customers/playlists)
    const createResponse = await request.post(`${targetUrl}/customers/playlists`, {
      headers: { 'Authorization': `Bearer ${customerAuth.token}` },
      data: {
        mac_address: dynamicMac,
        pin: '1234'
      }
    });

    // Note: If we don't know the exact schema, this might 400. We log it as a TEST_FAILURE.
    expect(createResponse.ok()).toBeTruthy();
    const createData = await createResponse.json();
    
    // Extract ID (handling both flat and nested responses)
    const playlistId = createData.id || (createData.data && createData.data.id);
    expect(playlistId).toBeDefined();

    // Register cleanup (SR-05) immediately
    cleanupManager.register({
      method: 'DELETE',
      url: `${targetUrl}/customers/playlists/${playlistId}`,
      token: customerAuth.token,
      description: `Delete playlist ${playlistId}`
    });

    // Step 2: Modify Playlist (PUT /customers/playlists/{id})
    const updateResponse = await request.put(`${targetUrl}/customers/playlists/${playlistId}`, {
      headers: { 'Authorization': `Bearer ${customerAuth.token}` },
      data: {
        pin: '4321'
      }
    });
    expect(updateResponse.ok()).toBeTruthy();

    // Step 3: Cleanup will automatically run in afterEach, validating the DELETE endpoint.
  });
});
