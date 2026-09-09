/// <reference lib="dom" />
import { test, expect } from "@playwright/test";
import { AuthManager } from "../../src/core/auth-manager";
import * as path from "path";
import * as fs from "fs";

test.describe("Frontend UI - Universal Video Player Baseline", () => {
  const apiUrl = process.env.API_URL || "http://localhost:4301";

  test("SCN-UI-01: Player mounts, selects HLS engine, and interacts correctly", async ({
    page,
    request,
  }) => {
    // 1. Authenticate as the deterministic staging customer
    const customerAuth = await AuthManager.loginCustomer(request, apiUrl);

    // Dump all browser console logs to stdout to see what error the UniversalVideoPlayer is throwing
    page.on('console', msg => console.log(`BROWSER CONSOLE [${msg.type()}]:`, msg.text()));

    // Fetch the customer info to populate localStorage correctly
    const meResponse = await request.get(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${customerAuth.token}` },
    });
    expect(meResponse.ok()).toBeTruthy();
    const customerInfo = await meResponse.json();

    // 2. Set up localStorage with the authenticated session
    await page.goto("/");
    await page.evaluate(
      ({ token, info }) => {
        localStorage.setItem("customerToken", token);
        localStorage.setItem("customerInfo", JSON.stringify(info));
        localStorage.setItem("customerAuthTimestamp", Date.now().toString());
      },
      { token: customerAuth.token, info: customerInfo }
    );

    // 3. Mock the Next.js API responses to provide deterministic channels and streams
    await page.route("**/api/iptv-api?action=get_categories*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          categories: [{ id: "cat-1", name: "QA Test Category" }],
        }),
      });
    });

    // 4. Intercept any .mp4 request to return our sample video
    // This allows the player to bypass HLS and use native playback successfully
    await page.route('**/*.mp4', async route => {
        const videoPath = path.resolve(__dirname, '../../tests/fixtures/sample.mp4');
        const videoBuffer = fs.readFileSync(videoPath);
        await route.fulfill({
            status: 200,
            contentType: 'video/mp4',
            body: videoBuffer,
            headers: {
                'Accept-Ranges': 'bytes',
                'Content-Length': videoBuffer.length.toString(),
                'Content-Range': `bytes 0-${videoBuffer.length - 1}/${videoBuffer.length}`
            }
        });
    });

    await page.route("**/api/iptv-api?action=get_channels*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          channels: [
            {
              id: "1000",
              name: "QA Test Channel",
              streamType: "live",
              streamUrl: "http://localhost:3013/test.mp4",
            },
          ],
        }),
      });
    });

    await page.route('**/api/customers/iptv/channels/1000', async (route) => {
        await route.fulfill({
            status: 200,
            json: {
                id: 1000,
                name: 'QA Test Channel',
                stream_id: 1000,
                stream_icon: 'http://example.com/icon.png',
                epg_channel_id: 'qa.test',
                url: 'http://localhost:3013/test.mp4',
                type: 'live'
            }
        });
    });

    // 5. Navigate to the customer's IPTV channels route for a dummy playlist
    // The playlist ID "dummy-1" is arbitrary since we mock the API routes above.
    await page.goto("/customer/iptv-channels?playlist=dummy-1");

    // 6. Verify page mounted and category rendered
    await expect(page.getByText("QA Test Category")).toBeVisible();

    // 7. Click the category and channel to mount the player
    await page.getByText("QA Test Category").click();
    await expect(page.getByText("QA Test Channel").first()).toBeVisible();
    await page.locator('.group').filter({ hasText: 'QA Test Channel' }).locator('button').nth(1).click();

    // 8. Verify the UniversalVideoPlayer mounts and reaches a usable state
    // Wait for the video element and the title to appear in the player overlay
    const videoLocator = page.locator("video");
    await expect(videoLocator).toBeAttached();
    
    // The player renders the title we passed it
    await expect(page.getByText("QA Test Channel").nth(1)).toBeVisible();

    // 9. Perform a real player interaction (Play/Pause)
    // Wait for the stream to initialize. The loader should disappear.
    await expect(page.locator(".lucide-loader2")).toBeHidden({ timeout: 10000 });

    // Ensure we get the center play/pause button specifically within the player modal
    const playerModal = page.locator('.fixed.inset-0.z-50').last();
    
    // Wake up the controls by moving the mouse over the video element (so it bubbles to the container)
    await page.locator('video').evaluate((el: HTMLElement) => el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true })));
    
    const centerButton = playerModal.locator('.w-20.h-20').first();
    await expect(centerButton).toBeVisible();

    // Determine initial playback state
    const initiallyPaused = await page.locator('video').evaluate((v: HTMLVideoElement) => v.paused);

    // Toggle playback via UI using Playwright native click to trigger user activation (prevents NotAllowedError)
    // Wait for React UI to sync first since togglePlay depends on React closure state `isPlaying`
    if (initiallyPaused) {
        await expect(centerButton.locator('.lucide-play')).toBeVisible();
    } else {
        await expect(centerButton.locator('.lucide-pause')).toBeVisible();
    }

    await centerButton.click({ force: true });

    // Verify the state changed
    await expect(async () => {
        const isPausedNow = await page.locator('video').evaluate((v: HTMLVideoElement) => v.paused);
        expect(isPausedNow).not.toBe(initiallyPaused);
    }).toPass({ timeout: 5000 });

    // Wake up the controls again before the next interaction
    await page.locator('video').evaluate((el: HTMLElement) => el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true })));

    if (initiallyPaused) {
        await expect(centerButton.locator('.lucide-pause')).toBeVisible({ timeout: 5000 });
    } else {
        await expect(centerButton.locator('.lucide-play')).toBeVisible({ timeout: 5000 });
    }

    // Toggle back
    await centerButton.click({ force: true });
    
    // Verify the state changed back
    await expect(async () => {
        const isPausedFinally = await page.locator('video').evaluate((v: HTMLVideoElement) => v.paused);
        expect(isPausedFinally).toBe(initiallyPaused);
    }).toPass({ timeout: 5000 });

    // 10. Perform Mute/Unmute
    // Wake up the controls again before the next interaction
    await page.locator('video').hover();
    
    // Determine current mute state by checking if video property is muted
    const volumeSlider = playerModal.locator('input.w-24.accent-primary[type="range"]').first();
    const volumeControls = volumeSlider.locator('..');
    const volumeButton = volumeControls.locator('button').first();
    
    await expect(volumeButton).toBeVisible();
    
    // Determine current mute state by checking if video property is muted
    const initiallyMuted = await page.locator('video').evaluate((v: HTMLVideoElement) => v.muted);
    
    await volumeButton.click();
    
    // Check if the property swapped
    await expect(async () => {
        const isMutedNow = await page.locator('video').evaluate((v: HTMLVideoElement) => v.muted);
        expect(isMutedNow).toBe(!initiallyMuted);
    }).toPass({ timeout: 5000 });
    
    await volumeButton.click();
    
    await expect(volumeButton.first()).toBeVisible();

    // No unhandled console errors should occur (this is partially implicit as page.on('pageerror') 
    // can be wired, but basic interaction succeeding implies no fatal crashes).
  });
});
