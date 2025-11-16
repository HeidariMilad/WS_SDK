import { describe, it, before, beforeEach } from "node:test";
import assert from "node:assert";
import { JSDOM } from "jsdom";
import { handleHighlight } from "../dist/commands/highlight.js";

describe("highlight command", () => {
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

  it("should warn when elementId is missing", async () => {
    const payload = {
      command: "highlight",
      requestId: "test-1",
    };

    const result = await handleHighlight(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /requires elementId/);
    assert.strictEqual(result.requestId, "test-1");
  });

  it("should warn when element is not found", async () => {
    const payload = {
      command: "highlight",
      requestId: "test-2",
      elementId: "nonexistent",
    };

    const result = await handleHighlight(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /not found/);
  });

  it("should apply highlight with default options", async () => {
    const element = document.createElement("div");
    element.setAttribute("data-elementid", "highlight-target");
    document.body.appendChild(element);

    const payload = {
      command: "highlight",
      requestId: "test-3",
      elementId: "highlight-target",
    };

    const result = await handleHighlight(payload);

    assert.strictEqual(result.status, "ok");
    assert.match(result.details, /Highlighted 'highlight-target'/);
    assert.ok(element.style.outline.includes("3px"));
    assert.ok(element.style.outline.includes("#3b82f6"));
    assert.strictEqual(element.style.outlineOffset, "2px");
  });

  it("should apply highlight with custom color and thickness", async () => {
    const element = document.createElement("div");
    element.setAttribute("data-elementid", "custom-target");
    document.body.appendChild(element);

    const payload = {
      command: "highlight",
      requestId: "test-4",
      elementId: "custom-target",
      payload: {
        options: {
          color: "#ff0000",
          thickness: 5,
          duration: 200,
        },
      },
    };

    const result = await handleHighlight(payload);

    assert.strictEqual(result.status, "ok");
    assert.ok(element.style.outline.includes("5px"));
    assert.ok(element.style.outline.includes("#ff0000"));
  });

  it("should cleanup styles after duration", async () => {
    const element = document.createElement("div");
    element.setAttribute("data-elementid", "cleanup-target");
    element.style.outline = "1px solid black";
    const originalOutline = element.style.outline;
    document.body.appendChild(element);

    const payload = {
      command: "highlight",
      requestId: "test-5",
      elementId: "cleanup-target",
      payload: {
        options: {
          duration: 50, // Short duration for testing
        },
      },
    };

    const result = await handleHighlight(payload);

    assert.strictEqual(result.status, "ok");
    assert.notStrictEqual(element.style.outline, originalOutline);

    // Wait for cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Styles should be restored
    assert.strictEqual(element.style.outline, originalOutline);
  });

  it("should handle multiple highlights on same element", async () => {
    const element = document.createElement("div");
    element.setAttribute("data-elementid", "multi-target");
    document.body.appendChild(element);

    const payload1 = {
      command: "highlight",
      requestId: "test-6a",
      elementId: "multi-target",
      payload: { options: { duration: 100 } },
    };

    const payload2 = {
      command: "highlight",
      requestId: "test-6b",
      elementId: "multi-target",
      payload: { options: { duration: 100, color: "#00ff00" } },
    };

    await handleHighlight(payload1);
    const result2 = await handleHighlight(payload2);

    assert.strictEqual(result2.status, "ok");
    assert.ok(element.style.outline.includes("#00ff00"));
  });
});
