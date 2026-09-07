import { test, expect } from "@playwright/test";
import { SafetyGate } from "../../src/config/safety-gate";
import { AuthManager } from "../../src/core/auth-manager";
import * as path from "path";

test.describe("Smoke Tests - Authentication (SCN-F-02)", () => {
  const targetUrl = process.env.BASE_URL as string;
  const rootDir = path.resolve(__dirname, "../../");

  test.beforeAll(() => {
    // SR-01 ENFORCEMENT
    // This will throw and block execution if the document is missing or invalid.
    SafetyGate.enforceFunctionalProduction(targetUrl, rootDir);
  });

  test("TC-F-02: Admin Login should succeed and return token", async ({
    request,
  }) => {
    const authContext = await AuthManager.loginAdmin(request, targetUrl);
    expect(authContext.token).toBeDefined();
    expect(authContext.token.length).toBeGreaterThan(10);
    expect(authContext.type).toBe("admin");
  });

  test("TC-F-03: Admin Login with invalid credentials should fail", async ({
    request,
  }) => {
    const response = await request.post(`${targetUrl}/auth/login`, {
      data: { email: "invalid@example.com", password: "wrongpassword" },
    });
    expect(response.status()).toBe(401);
  });

  test("TC-F-04: GET /auth/me without token returns 401", async ({
    request,
  }) => {
    const response = await request.get(`${targetUrl}/auth/me`);
    expect(response.status()).toBe(401);
  });

  test("TC-F-05: GET /auth/me with valid token returns user profile", async ({
    request,
  }) => {
    const authContext = await AuthManager.loginAdmin(request, targetUrl);

    const response = await request.get(`${targetUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authContext.token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("email");
  });
});
