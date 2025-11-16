const { test } = require("node:test");
const assert = require("node:assert/strict");
const { JSDOM } = require("jsdom");

// NOTE: Tests expect `npm run build` (tsc) to have been executed
const {
  resolveTargetByDataElementId,
  resolveTargetBySelector,
  resolveTarget,
} = require("../dist/targeting/index.js");

// Setup JSDOM for DOM operations
function setupDOM() {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.CSS = dom.window.CSS;
  return dom;
}

function teardownDOM() {
  delete global.document;
  delete global.HTMLElement;
  delete global.CSS;
}

test("resolveTargetByDataElementId - element present immediately", async () => {
  setupDOM();
  const div = document.createElement("div");
  div.setAttribute("data-elementid", "test-element");
  document.body.appendChild(div);

  const result = await resolveTargetByDataElementId("test-element", {
    retries: 5,
    intervalMs: 10,
  });

  assert.equal(result.element, div);
  assert.equal(result.warnings.length, 0);
  teardownDOM();
});

test("resolveTargetByDataElementId - element not found", async () => {
  setupDOM();

  const result = await resolveTargetByDataElementId("missing-element", {
    retries: 2,
    intervalMs: 10,
  });

  assert.equal(result.element, null);
  assert.equal(result.warnings.length, 1);
  assert.equal(result.warnings[0].elementId, "missing-element");
  assert.equal(result.warnings[0].reason, "not-found");
  teardownDOM();
});

test("resolveTargetByDataElementId - element appears after delay", async () => {
  setupDOM();
  const div = document.createElement("div");
  div.setAttribute("data-elementid", "delayed-element");

  // Add element after 150ms
  setTimeout(() => {
    document.body.appendChild(div);
  }, 150);

  const result = await resolveTargetByDataElementId("delayed-element", {
    retries: 5,
    intervalMs: 50,
  });

  assert.equal(result.element, div);
  assert.equal(result.warnings.length, 0);
  teardownDOM();
});

test("resolveTargetBySelector - valid selector finds element", async () => {
  setupDOM();
  const div = document.createElement("div");
  div.className = "test-class";
  document.body.appendChild(div);

  const result = await resolveTargetBySelector(".test-class", {
    retries: 3,
    intervalMs: 10,
  });

  assert.equal(result.element, div);
  assert.equal(result.warnings.length, 0);
  teardownDOM();
});

test("resolveTargetBySelector - invalid selector", async () => {
  setupDOM();

  const result = await resolveTargetBySelector("::invalid::", {
    retries: 2,
    intervalMs: 10,
  });

  assert.equal(result.element, null);
  assert.equal(result.warnings.length, 1);
  assert.equal(result.warnings[0].selector, "::invalid::");
  assert.equal(result.warnings[0].reason, "invalid-selector");
  teardownDOM();
});

test("resolveTargetBySelector - element not found", async () => {
  setupDOM();

  const result = await resolveTargetBySelector(".missing-class", {
    retries: 2,
    intervalMs: 10,
  });

  assert.equal(result.element, null);
  assert.equal(result.warnings.length, 1);
  assert.equal(result.warnings[0].selector, ".missing-class");
  assert.equal(result.warnings[0].reason, "not-found");
  teardownDOM();
});

test("resolveTarget - precedence: elementId found", async () => {
  setupDOM();
  const div1 = document.createElement("div");
  div1.setAttribute("data-elementid", "priority-element");
  document.body.appendChild(div1);

  const div2 = document.createElement("div");
  div2.className = "fallback-class";
  document.body.appendChild(div2);

  const result = await resolveTarget({
    elementId: "priority-element",
    selector: ".fallback-class",
    retries: 3,
    intervalMs: 10,
  });

  // Should return the element matched by elementId, not selector
  assert.equal(result.element, div1);
  assert.equal(result.warnings.length, 0);
  teardownDOM();
});

test("resolveTarget - precedence: elementId fails, selector succeeds", async () => {
  setupDOM();
  const div = document.createElement("div");
  div.className = "fallback-class";
  document.body.appendChild(div);

  const result = await resolveTarget({
    elementId: "missing-element",
    selector: ".fallback-class",
    retries: 2,
    intervalMs: 10,
  });

  // Should return the element matched by selector
  assert.equal(result.element, div);
  // Should have warning for missing elementId
  assert.equal(result.warnings.length, 1);
  assert.equal(result.warnings[0].elementId, "missing-element");
  assert.equal(result.warnings[0].reason, "not-found");
  teardownDOM();
});

test("resolveTarget - both elementId and selector fail", async () => {
  setupDOM();

  const result = await resolveTarget({
    elementId: "missing-element",
    selector: ".missing-class",
    retries: 2,
    intervalMs: 10,
  });

  assert.equal(result.element, null);
  assert.equal(result.warnings.length, 2);
  assert.equal(result.warnings[0].elementId, "missing-element");
  assert.equal(result.warnings[0].reason, "not-found");
  assert.equal(result.warnings[1].selector, ".missing-class");
  assert.equal(result.warnings[1].reason, "not-found");
  teardownDOM();
});

test("resolveTarget - no target provided", async () => {
  setupDOM();

  const result = await resolveTarget({
    retries: 2,
    intervalMs: 10,
  });

  assert.equal(result.element, null);
  assert.equal(result.warnings.length, 1);
  assert.equal(result.warnings[0].reason, "no-target-provided");
  teardownDOM();
});

test("resolveTargetByDataElementId - escapes special characters", async () => {
  setupDOM();
  const div = document.createElement("div");
  div.setAttribute("data-elementid", "element:with:colons");
  document.body.appendChild(div);

  const result = await resolveTargetByDataElementId("element:with:colons", {
    retries: 2,
    intervalMs: 10,
  });

  assert.equal(result.element, div);
  assert.equal(result.warnings.length, 0);
  teardownDOM();
});
