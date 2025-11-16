import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { handleNavigate, registerNavigationRouter, unregisterNavigationRouter } from "../dist/commands/navigate.js";

describe("navigate command", () => {
  let mockRouter;
  let navigateCalls;

  before(() => {
    navigateCalls = [];
    mockRouter = {
      push: (path) => {
        navigateCalls.push({ method: "push", path });
      },
      replace: (path) => {
        navigateCalls.push({ method: "replace", path });
      },
    };
  });

  after(() => {
    unregisterNavigationRouter();
  });

  it("should warn when router is not registered", () => {
    unregisterNavigationRouter();
    const payload = {
      command: "navigate",
      requestId: "test-1",
      payload: { value: "/dashboard" },
    };

    const result = handleNavigate(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /not registered/);
    assert.strictEqual(result.requestId, "test-1");
  });

  it("should navigate using payload.value format", () => {
    registerNavigationRouter(mockRouter);
    navigateCalls = [];

    const payload = {
      command: "navigate",
      requestId: "test-2",
      payload: { value: "/about" },
    };

    const result = handleNavigate(payload);

    assert.strictEqual(result.status, "ok");
    assert.match(result.details, /Navigated to: \/about/);
    assert.strictEqual(navigateCalls.length, 1);
    assert.strictEqual(navigateCalls[0].method, "push");
    assert.strictEqual(navigateCalls[0].path, "/about");
  });

  it("should navigate using payload.options.path format", () => {
    registerNavigationRouter(mockRouter);
    navigateCalls = [];

    const payload = {
      command: "navigate",
      requestId: "test-3",
      payload: { options: { path: "/contact" } },
    };

    const result = handleNavigate(payload);

    assert.strictEqual(result.status, "ok");
    assert.match(result.details, /Navigated to: \/contact/);
    assert.strictEqual(navigateCalls.length, 1);
    assert.strictEqual(navigateCalls[0].path, "/contact");
  });

  it("should use replace method when specified", () => {
    registerNavigationRouter(mockRouter);
    navigateCalls = [];

    const payload = {
      command: "navigate",
      requestId: "test-4",
      payload: {
        value: "/settings",
        options: { replace: true },
      },
    };

    const result = handleNavigate(payload);

    assert.strictEqual(result.status, "ok");
    assert.strictEqual(navigateCalls.length, 1);
    assert.strictEqual(navigateCalls[0].method, "replace");
    assert.strictEqual(navigateCalls[0].path, "/settings");
  });

  it("should warn when destination path is missing", () => {
    registerNavigationRouter(mockRouter);
    navigateCalls = [];

    const payload = {
      command: "navigate",
      requestId: "test-5",
      payload: { options: {} },
    };

    const result = handleNavigate(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /missing destination path/);
    assert.strictEqual(navigateCalls.length, 0);
  });

  it("should warn when payload is empty", () => {
    registerNavigationRouter(mockRouter);
    navigateCalls = [];

    const payload = {
      command: "navigate",
      requestId: "test-6",
    };

    const result = handleNavigate(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /missing destination path/);
    assert.strictEqual(navigateCalls.length, 0);
  });

  it("should handle router errors gracefully", () => {
    const errorRouter = {
      push: () => {
        throw new Error("Navigation failed");
      },
    };
    registerNavigationRouter(errorRouter);

    const payload = {
      command: "navigate",
      requestId: "test-7",
      payload: { value: "/error" },
    };

    const result = handleNavigate(payload);

    assert.strictEqual(result.status, "error");
    assert.match(result.details, /Navigation failed/);
  });
});
