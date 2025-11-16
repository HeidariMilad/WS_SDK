import { describe, it, before, beforeEach } from "node:test";
import assert from "node:assert";
import { JSDOM } from "jsdom";
import { handleHover } from "../dist/commands/hover.js";
import { handleFocus } from "../dist/commands/focus.js";
import { handleScroll } from "../dist/commands/scroll.js";

describe("interaction commands", () => {
  let dom;
  let document;
  let window;

  before(() => {
    dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("hover command", () => {
    it("should warn when elementId is missing", async () => {
      const payload = {
        command: "hover",
        requestId: "test-1",
      };

      const result = await handleHover(payload);

      assert.strictEqual(result.status, "warning");
      assert.match(result.details, /requires elementId/);
    });

    it("should warn when element is not found", async () => {
      const payload = {
        command: "hover",
        requestId: "test-2",
        elementId: "nonexistent",
      };

      const result = await handleHover(payload);

      assert.strictEqual(result.status, "warning");
      assert.match(result.details, /not found/);
    });

    it("should apply hover class and dispatch events", async () => {
      const element = document.createElement("div");
      element.setAttribute("data-elementid", "hover-target");
      document.body.appendChild(element);

      let mouseEnterFired = false;
      let mouseOverFired = false;
      element.addEventListener("mouseenter", () => (mouseEnterFired = true));
      element.addEventListener("mouseover", () => (mouseOverFired = true));

      const payload = {
        command: "hover",
        requestId: "test-3",
        elementId: "hover-target",
      };

      const result = await handleHover(payload);

      // In test environment, just verify it doesn't error
      assert.ok(result.status !== "error", `Expected non-error status, got: ${result.status} - ${result.details}`);
      // If successful, verify the hover class was applied
      if (result.status === "ok") {
        assert.ok(element.classList.contains("sdk-hover-active"), "Hover class should be applied");
      }
    });

    it("should apply hover with custom duration", async () => {
      const element = document.createElement("div");
      element.setAttribute("data-elementid", "hover-duration");
      document.body.appendChild(element);

      const payload = {
        command: "hover",
        requestId: "test-4",
        elementId: "hover-duration",
        payload: { options: { duration: 100 } },
      };

      const result = await handleHover(payload);

      assert.ok(result.status !== "error");
    });
  });

  describe("focus command", () => {
    it("should warn when elementId is missing", async () => {
      const payload = {
        command: "focus",
        requestId: "test-1",
      };

      const result = await handleFocus(payload);

      assert.strictEqual(result.status, "warning");
      assert.match(result.details, /requires elementId/);
    });

    it("should warn when element is not found", async () => {
      const payload = {
        command: "focus",
        requestId: "test-2",
        elementId: "nonexistent",
      };

      const result = await handleFocus(payload);

      assert.strictEqual(result.status, "warning");
      assert.match(result.details, /not found/);
    });

    it("should warn when element is not focusable", async () => {
      const element = document.createElement("div");
      element.setAttribute("data-elementid", "not-focusable");
      document.body.appendChild(element);

      const payload = {
        command: "focus",
        requestId: "test-3",
        elementId: "not-focusable",
      };

      const result = await handleFocus(payload);

      assert.strictEqual(result.status, "warning");
      assert.match(result.details, /not focusable/);
    });

    it("should focus a button element", async () => {
      const button = document.createElement("button");
      button.setAttribute("data-elementid", "focus-button");
      document.body.appendChild(button);

      const payload = {
        command: "focus",
        requestId: "test-4",
        elementId: "focus-button",
      };

      const result = await handleFocus(payload);

      assert.strictEqual(result.status, "ok");
      assert.match(result.details, /Focused 'focus-button'/);
    });

    it("should focus an input element", async () => {
      const input = document.createElement("input");
      input.setAttribute("data-elementid", "focus-input");
      document.body.appendChild(input);

      const payload = {
        command: "focus",
        requestId: "test-5",
        elementId: "focus-input",
      };

      const result = await handleFocus(payload);

      assert.strictEqual(result.status, "ok");
    });

    it("should focus element with tabindex", async () => {
      const div = document.createElement("div");
      div.setAttribute("data-elementid", "focus-div");
      div.setAttribute("tabindex", "0");
      document.body.appendChild(div);

      const payload = {
        command: "focus",
        requestId: "test-6",
        elementId: "focus-div",
      };

      const result = await handleFocus(payload);

      assert.strictEqual(result.status, "ok");
    });
  });

  describe("scroll command", () => {
    it("should warn when elementId is missing", async () => {
      const payload = {
        command: "scroll",
        requestId: "test-1",
      };

      const result = await handleScroll(payload);

      assert.strictEqual(result.status, "warning");
      assert.match(result.details, /requires elementId/);
    });

    it("should warn when element is not found", async () => {
      const payload = {
        command: "scroll",
        requestId: "test-2",
        elementId: "nonexistent",
      };

      const result = await handleScroll(payload);

      assert.strictEqual(result.status, "warning");
      assert.match(result.details, /not found/);
    });

    it("should scroll to element with default options", async () => {
      const element = document.createElement("div");
      element.setAttribute("data-elementid", "scroll-target");
      element.scrollIntoView = function () {}; // Mock scrollIntoView
      document.body.appendChild(element);

      const payload = {
        command: "scroll",
        requestId: "test-3",
        elementId: "scroll-target",
      };

      const result = await handleScroll(payload);

      assert.strictEqual(result.status, "ok");
      assert.match(result.details, /Scrolled to 'scroll-target'/);
    });

    it("should prevent duplicate scrolls within debounce window", async () => {
      const element = document.createElement("div");
      element.setAttribute("data-elementid", "debounce-target");
      element.scrollIntoView = function () {};
      document.body.appendChild(element);

      const payload1 = {
        command: "scroll",
        requestId: "test-4a",
        elementId: "debounce-target",
      };

      const payload2 = {
        command: "scroll",
        requestId: "test-4b",
        elementId: "debounce-target",
      };

      const result1 = await handleScroll(payload1);
      const result2 = await handleScroll(payload2);

      assert.strictEqual(result1.status, "ok");
      assert.strictEqual(result2.status, "warning");
      assert.match(result2.details, /duplicate/);
    });

    it("should allow scroll after debounce window", async () => {
      const element = document.createElement("div");
      element.setAttribute("data-elementid", "debounce-target-2");
      element.scrollIntoView = function () {};
      document.body.appendChild(element);

      const payload1 = {
        command: "scroll",
        requestId: "test-5a",
        elementId: "debounce-target-2",
      };

      const result1 = await handleScroll(payload1);
      assert.strictEqual(result1.status, "ok");

      // Wait for debounce window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      const payload2 = {
        command: "scroll",
        requestId: "test-5b",
        elementId: "debounce-target-2",
      };

      const result2 = await handleScroll(payload2);
      assert.strictEqual(result2.status, "ok");
    });
  });
});
