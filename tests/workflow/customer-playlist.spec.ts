import { test, expect } from "@playwright/test";
import { SafetyGate } from "../../src/config/safety-gate";
import { AuthManager, AuthContext } from "../../src/core/auth-manager";
import { CleanupManager } from "../../src/core/cleanup-manager";
import * as path from "path";

test.describe("Workflow Tests - Playlist Lifecycle (SCN-W-02 / CWF-07)", () => {
  const targetUrl = process.env.BASE_URL as string;
  const rootDir = path.resolve(__dirname, "../../");

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

  test("TC-W-02: End-to-end Playlist Creation, Modification, and Deletion", async ({
    request,
  }) => {
    // Step 1: Create Playlist (POST /customers/playlists)
    const createResponse = await request.post(
      `${targetUrl}/customers/playlists`,
      {
        headers: { Authorization: `Bearer ${customerAuth.token}` },
        data: {
          name: "QA End-to-End Playlist",
          url: "https://example.com/playlist.m3u",
          type: "m3u",
        },
      },
    );

    // Note: If we don't know the exact schema, this might 400. We log it as a TEST_FAILURE.
    expect(createResponse.ok()).toBeTruthy();
    const createData = await createResponse.json();

    // Extract ID (handling both flat and nested responses)
    const playlistId = createData.id || (createData.data && createData.data.id);
    expect(playlistId).toBeDefined();

    // Register cleanup (SR-05) immediately
    cleanupManager.register({
      method: "DELETE",
      url: `${targetUrl}/customers/playlists/${playlistId}`,
      token: customerAuth.token,
      description: `Delete playlist ${playlistId}`,
    });

    // Step 2: Modify Playlist (PUT /customers/playlists/{id})
    const updateResponse = await request.put(
      `${targetUrl}/customers/playlists/${playlistId}`,
      {
        headers: { Authorization: `Bearer ${customerAuth.token}` },
        data: {
          name: "QA End-to-End Playlist - Updated",
        },
      },
    );
    expect(updateResponse.ok()).toBeTruthy();

    // Step 3: Cleanup will automatically run in afterEach, validating the DELETE endpoint.
  });
});
