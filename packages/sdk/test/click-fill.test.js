import { describe, it, before, beforeEach } from "node:test";
import assert from "node:assert";
import { JSDOM } from "jsdom";
import { handleClick } from "../dist/commands/click.js";
import { handleFill } from "../dist/commands/fill.js";

describe("click command", () => {
  let dom;
  let document;
  let window;

  before(() => {
    dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
    global.HTMLInputElement = window.HTMLInputElement;
    global.HTMLTextAreaElement = window.HTMLTextAreaElement;
    global.MouseEvent = window.MouseEvent;
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should warn when elementId is missing", async () => {
    const payload = {
      command: "click",
      requestId: "test-1",
    };

    const result = await handleClick(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /requires elementId/);
    assert.strictEqual(result.requestId, "test-1");
  });

  it("should warn when element is not found", async () => {
    const payload = {
      command: "click",
      requestId: "test-2",
      elementId: "nonexistent",
    };

    const result = await handleClick(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /not found/);
  });

  it("should dispatch click events on button element", async () => {
    const button = document.createElement("button");
    button.setAttribute("data-elementid", "click-target");
    document.body.appendChild(button);

    const events = [];
    ["mousedown", "mouseup", "click"].forEach((eventName) => {
      button.addEventListener(eventName, (e) => {
        events.push({ type: e.type, button: e.button });
      });
    });

    const payload = {
      command: "click",
      requestId: "test-3",
      elementId: "click-target",
    };

    const result = await handleClick(payload);

    assert.strictEqual(result.status, "ok");
    assert.match(result.details, /Clicked 'click-target'/);
    assert.strictEqual(events.length, 3);
    assert.strictEqual(events[0].type, "mousedown");
    assert.strictEqual(events[1].type, "mouseup");
    assert.strictEqual(events[2].type, "click");
  });

  it("should support custom button option (right click)", async () => {
    const element = document.createElement("div");
    element.setAttribute("data-elementid", "rightclick-target");
    document.body.appendChild(element);

    let clickButton = -1;
    element.addEventListener("click", (e) => {
      clickButton = e.button;
    });

    const payload = {
      command: "click",
      requestId: "test-4",
      elementId: "rightclick-target",
      payload: {
        options: {
          button: 2, // Right click
        },
      },
    };

    const result = await handleClick(payload);

    assert.strictEqual(result.status, "ok");
    assert.strictEqual(clickButton, 2);
  });

  it("should support modifier keys", async () => {
    const element = document.createElement("div");
    element.setAttribute("data-elementid", "modifier-target");
    document.body.appendChild(element);

    let eventData = null;
    element.addEventListener("click", (e) => {
      eventData = {
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
      };
    });

    const payload = {
      command: "click",
      requestId: "test-5",
      elementId: "modifier-target",
      payload: {
        options: {
          shiftKey: true,
          ctrlKey: true,
        },
      },
    };

    const result = await handleClick(payload);

    assert.strictEqual(result.status, "ok");
    assert.strictEqual(eventData.shiftKey, true);
    assert.strictEqual(eventData.ctrlKey, true);
  });
});

describe("fill command", () => {
  let dom;
  let document;
  let window;

  before(() => {
    dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
    global.HTMLInputElement = window.HTMLInputElement;
    global.HTMLTextAreaElement = window.HTMLTextAreaElement;
    global.Event = window.Event;
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should warn when elementId is missing", async () => {
    const payload = {
      command: "fill",
      requestId: "test-1",
    };

    const result = await handleFill(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /requires elementId/);
  });

  it("should warn when value is missing", async () => {
    const payload = {
      command: "fill",
      requestId: "test-2",
      elementId: "some-input",
    };

    const result = await handleFill(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /requires 'value'/);
  });

  it("should warn when element is not found", async () => {
    const payload = {
      command: "fill",
      requestId: "test-3",
      elementId: "nonexistent",
      payload: {
        options: { value: "test" },
      },
    };

    const result = await handleFill(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /not found/);
  });

  it("should fill input element and dispatch events", async () => {
    const input = document.createElement("input");
    input.setAttribute("data-elementid", "text-input");
    document.body.appendChild(input);

    const events = [];
    input.addEventListener("input", (e) => events.push("input"));
    input.addEventListener("change", (e) => events.push("change"));

    const payload = {
      command: "fill",
      requestId: "test-4",
      elementId: "text-input",
      payload: {
        options: { value: "Hello World" },
      },
    };

    const result = await handleFill(payload);

    assert.strictEqual(result.status, "ok");
    assert.match(result.details, /Filled 'text-input'/);
    assert.strictEqual(input.value, "Hello World");
    assert.strictEqual(events.length, 2);
    assert.strictEqual(events[0], "input");
    assert.strictEqual(events[1], "change");
  });

  it("should fill textarea element", async () => {
    const textarea = document.createElement("textarea");
    textarea.setAttribute("data-elementid", "text-area");
    document.body.appendChild(textarea);

    const payload = {
      command: "fill",
      requestId: "test-5",
      elementId: "text-area",
      payload: {
        options: { value: "Multiline\nText" },
      },
    };

    const result = await handleFill(payload);

    assert.strictEqual(result.status, "ok");
    assert.strictEqual(textarea.value, "Multiline\nText");
  });

  it("should warn when trying to fill non-input element", async () => {
    const div = document.createElement("div");
    div.setAttribute("data-elementid", "not-input");
    document.body.appendChild(div);

    const payload = {
      command: "fill",
      requestId: "test-6",
      elementId: "not-input",
      payload: {
        options: { value: "test" },
      },
    };

    const result = await handleFill(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /not an input or textarea/);
  });

  it("should warn when element is disabled", async () => {
    const input = document.createElement("input");
    input.setAttribute("data-elementid", "disabled-input");
    input.disabled = true;
    document.body.appendChild(input);

    const payload = {
      command: "fill",
      requestId: "test-7",
      elementId: "disabled-input",
      payload: {
        options: { value: "test" },
      },
    };

    const result = await handleFill(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /is disabled/);
  });

  it("should not dispatch change event if value unchanged", async () => {
    const input = document.createElement("input");
    input.setAttribute("data-elementid", "same-value");
    input.value = "existing";
    document.body.appendChild(input);

    const events = [];
    input.addEventListener("input", () => events.push("input"));
    input.addEventListener("change", () => events.push("change"));

    const payload = {
      command: "fill",
      requestId: "test-8",
      elementId: "same-value",
      payload: {
        options: { value: "existing" },
      },
    };

    const result = await handleFill(payload);

    assert.strictEqual(result.status, "ok");
    // Input event should fire, but not change event (value didn't change)
    assert.strictEqual(events.length, 1);
    assert.strictEqual(events[0], "input");
  });

  it("should truncate long values in result details", async () => {
    const input = document.createElement("input");
    input.setAttribute("data-elementid", "long-value");
    document.body.appendChild(input);

    const longValue = "a".repeat(100);

    const payload = {
      command: "fill",
      requestId: "test-9",
      elementId: "long-value",
      payload: {
        options: { value: longValue },
      },
    };

    const result = await handleFill(payload);

    assert.strictEqual(result.status, "ok");
    assert.match(result.details, /\.\.\./); // Should be truncated
    assert.strictEqual(input.value, longValue); // But actual value is full
  });
});
