import { describe, it, before, beforeEach } from "node:test";
import assert from "node:assert";
import { JSDOM } from "jsdom";
import { handleClear } from "../dist/commands/clear.js";
import { handleSelect } from "../dist/commands/select.js";

describe("clear command", () => {
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
    global.HTMLSelectElement = window.HTMLSelectElement;
    global.Event = window.Event;
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should warn when elementId is missing", async () => {
    const payload = {
      command: "clear",
      requestId: "test-1",
    };

    const result = await handleClear(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /requires elementId/);
  });

  it("should warn when element is not found", async () => {
    const payload = {
      command: "clear",
      requestId: "test-2",
      elementId: "nonexistent",
    };

    const result = await handleClear(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /not found/);
  });

  it("should clear input element", async () => {
    const input = document.createElement("input");
    input.setAttribute("data-elementid", "clear-input");
    input.value = "existing value";
    document.body.appendChild(input);

    const events = [];
    input.addEventListener("input", () => events.push("input"));
    input.addEventListener("change", () => events.push("change"));

    const payload = {
      command: "clear",
      requestId: "test-3",
      elementId: "clear-input",
    };

    const result = await handleClear(payload);

    assert.strictEqual(result.status, "ok");
    assert.match(result.details, /Cleared 'clear-input'/);
    assert.strictEqual(input.value, "");
    assert.strictEqual(events.length, 2);
    assert.strictEqual(events[0], "input");
    assert.strictEqual(events[1], "change");
  });

  it("should clear textarea element", async () => {
    const textarea = document.createElement("textarea");
    textarea.setAttribute("data-elementid", "clear-textarea");
    textarea.value = "Some text";
    document.body.appendChild(textarea);

    const payload = {
      command: "clear",
      requestId: "test-4",
      elementId: "clear-textarea",
    };

    const result = await handleClear(payload);

    assert.strictEqual(result.status, "ok");
    assert.strictEqual(textarea.value, "");
  });

  it("should reset select element to first option", async () => {
    const select = document.createElement("select");
    select.setAttribute("data-elementid", "clear-select");
    
    const opt1 = document.createElement("option");
    opt1.value = "first";
    opt1.text = "First Option";
    select.appendChild(opt1);
    
    const opt2 = document.createElement("option");
    opt2.value = "second";
    opt2.text = "Second Option";
    opt2.selected = true;
    select.appendChild(opt2);
    
    document.body.appendChild(select);

    const payload = {
      command: "clear",
      requestId: "test-5",
      elementId: "clear-select",
    };

    const result = await handleClear(payload);

    assert.strictEqual(result.status, "ok");
    assert.strictEqual(select.selectedIndex, 0);
    assert.strictEqual(select.value, "first");
  });

  it("should warn when trying to clear non-clearable element", async () => {
    const div = document.createElement("div");
    div.setAttribute("data-elementid", "not-clearable");
    document.body.appendChild(div);

    const payload = {
      command: "clear",
      requestId: "test-6",
      elementId: "not-clearable",
    };

    const result = await handleClear(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /not an input, textarea, or select/);
  });

  it("should warn when element is disabled", async () => {
    const input = document.createElement("input");
    input.setAttribute("data-elementid", "disabled-input");
    input.disabled = true;
    document.body.appendChild(input);

    const payload = {
      command: "clear",
      requestId: "test-7",
      elementId: "disabled-input",
    };

    const result = await handleClear(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /is disabled/);
  });
});

describe("select command", () => {
  let dom;
  let document;
  let window;

  before(() => {
    dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
    global.HTMLSelectElement = window.HTMLSelectElement;
    global.Event = window.Event;
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should warn when elementId is missing", async () => {
    const payload = {
      command: "select",
      requestId: "test-1",
    };

    const result = await handleSelect(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /requires elementId/);
  });

  it("should warn when no selection criteria provided", async () => {
    const payload = {
      command: "select",
      requestId: "test-2",
      elementId: "some-select",
    };

    const result = await handleSelect(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /requires at least one of/);
  });

  it("should warn when element is not found", async () => {
    const payload = {
      command: "select",
      requestId: "test-3",
      elementId: "nonexistent",
      payload: {
        options: { value: "test" },
      },
    };

    const result = await handleSelect(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /not found/);
  });

  it("should select option by value", async () => {
    const select = document.createElement("select");
    select.setAttribute("data-elementid", "test-select");
    
    const opt1 = document.createElement("option");
    opt1.value = "option1";
    opt1.text = "Option 1";
    select.appendChild(opt1);
    
    const opt2 = document.createElement("option");
    opt2.value = "option2";
    opt2.text = "Option 2";
    select.appendChild(opt2);
    
    document.body.appendChild(select);

    const events = [];
    select.addEventListener("input", () => events.push("input"));
    select.addEventListener("change", () => events.push("change"));

    const payload = {
      command: "select",
      requestId: "test-4",
      elementId: "test-select",
      payload: {
        options: { value: "option2" },
      },
    };

    const result = await handleSelect(payload);

    assert.strictEqual(result.status, "ok");
    assert.match(result.details, /Selected option/);
    assert.match(result.details, /value="option2"/);
    assert.strictEqual(select.value, "option2");
    assert.strictEqual(select.selectedIndex, 1);
    assert.strictEqual(events.length, 2);
  });

  it("should select option by index", async () => {
    const select = document.createElement("select");
    select.setAttribute("data-elementid", "index-select");
    
    const opt1 = document.createElement("option");
    opt1.value = "a";
    opt1.text = "A";
    select.appendChild(opt1);
    
    const opt2 = document.createElement("option");
    opt2.value = "b";
    opt2.text = "B";
    select.appendChild(opt2);
    
    document.body.appendChild(select);

    const payload = {
      command: "select",
      requestId: "test-5",
      elementId: "index-select",
      payload: {
        options: { index: 1 },
      },
    };

    const result = await handleSelect(payload);

    assert.strictEqual(result.status, "ok");
    assert.match(result.details, /index=1/);
    assert.strictEqual(select.selectedIndex, 1);
  });

  it("should select option by label", async () => {
    const select = document.createElement("select");
    select.setAttribute("data-elementid", "label-select");
    
    const opt1 = document.createElement("option");
    opt1.value = "val1";
    opt1.text = "First Choice";
    select.appendChild(opt1);
    
    const opt2 = document.createElement("option");
    opt2.value = "val2";
    opt2.text = "Second Choice";
    select.appendChild(opt2);
    
    document.body.appendChild(select);

    const payload = {
      command: "select",
      requestId: "test-6",
      elementId: "label-select",
      payload: {
        options: { label: "Second Choice" },
      },
    };

    const result = await handleSelect(payload);

    assert.strictEqual(result.status, "ok");
    assert.match(result.details, /label="Second Choice"/);
    assert.strictEqual(select.selectedIndex, 1);
  });

  it("should warn when trying to select non-select element", async () => {
    const input = document.createElement("input");
    input.setAttribute("data-elementid", "not-select");
    document.body.appendChild(input);

    const payload = {
      command: "select",
      requestId: "test-7",
      elementId: "not-select",
      payload: {
        options: { value: "test" },
      },
    };

    const result = await handleSelect(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /not a select element/);
  });

  it("should warn when option not found", async () => {
    const select = document.createElement("select");
    select.setAttribute("data-elementid", "no-match");
    
    const opt = document.createElement("option");
    opt.value = "exists";
    opt.text = "Exists";
    select.appendChild(opt);
    
    document.body.appendChild(select);

    const payload = {
      command: "select",
      requestId: "test-8",
      elementId: "no-match",
      payload: {
        options: { value: "nonexistent" },
      },
    };

    const result = await handleSelect(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /No option found/);
  });

  it("should warn when select element is disabled", async () => {
    const select = document.createElement("select");
    select.setAttribute("data-elementid", "disabled-select");
    select.disabled = true;
    document.body.appendChild(select);

    const payload = {
      command: "select",
      requestId: "test-9",
      elementId: "disabled-select",
      payload: {
        options: { index: 0 },
      },
    };

    const result = await handleSelect(payload);

    assert.strictEqual(result.status, "warning");
    assert.match(result.details, /is disabled/);
  });
});
