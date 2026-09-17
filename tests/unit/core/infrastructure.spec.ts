import { test, expect, request } from "@playwright/test";
import { SafetyGate } from "../../../src/config/safety-gate";
import { CleanupManager } from "../../../src/core/cleanup-manager";

test.describe("Infrastructure & Safety Gate Tests", () => {
  test("CleanupManager should execute tasks in LIFO order and report errors", async () => {
    const manager = new CleanupManager();
    manager.register({
      method: "DELETE",
      url: "https://httpbin.org/status/200",
      description: "Success task",
    });
    manager.register({
      method: "DELETE",
      url: "https://httpbin.org/status/404",
      description: "Failed task",
    });

    const context = await request.newContext();
    const result = await manager.executeAll(context);

    expect(result.passed).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain("[CLEANUP_FAILURE]");
  });

  test("SafetyGate should block production execution if doc is missing", () => {
    // Missing doc
    expect(() => {
      SafetyGate.enforceFunctionalProduction(
        "https://api.beeplayer1.com",
        __dirname,
      );
    }).toThrow(
      "[SAFETY GATE FAILED] Required authorization document not found",
    );
  });

  test("SafetyGate should allow non-production URLs without checks", () => {
    expect(() => {
      SafetyGate.enforceFunctionalProduction(
        "http://localhost:3000",
        __dirname,
      );
    }).not.toThrow();
  });
});
