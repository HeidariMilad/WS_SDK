/**
 * Unit tests for AI overlay registry
 */

import { describe, it, before } from "node:test";
import assert from "node:assert";
import { JSDOM } from "jsdom";

// Setup JSDOM environment
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

// Import modules after setting up globals
const {
  registerOverlay,
  unregisterOverlay,
  getOverlayByElement,
  getOverlayById,
  getOverlayByElementId,
  getAllOverlays,
  hasOverlay,
  clearAllOverlays,
  updateOverlay,
  generateOverlayId,
} = await import("../dist/ai-overlay/registry.js");

describe("AI Overlay Registry", () => {
  describe("generateOverlayId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateOverlayId();
      const id2 = generateOverlayId();

      assert.notEqual(id1, id2);
      assert.match(id1, /^sdk-overlay-\d+-\d+$/);
      assert.match(id2, /^sdk-overlay-\d+-\d+$/);
    });
  });

  describe("registerOverlay", () => {
    it("should register an overlay for an element", () => {
      const element = document.createElement("button");
      element.setAttribute("data-elementid", "test-button");

      const config = {
        elementId: "test-button",
        options: {},
        targetElement: element,
        overlayId: "overlay-1",
      };

      registerOverlay(element, config);

      const retrieved = getOverlayByElement(element);
      assert.strictEqual(retrieved, config);
    });

    it("should replace existing overlay for same element", () => {
      const element = document.createElement("button");
      element.setAttribute("data-elementid", "test-button-2");

      const config1 = {
        elementId: "test-button-2",
        options: { placement: "top-left" },
        targetElement: element,
        overlayId: "overlay-1",
      };

      const config2 = {
        elementId: "test-button-2",
        options: { placement: "bottom-right" },
        targetElement: element,
        overlayId: "overlay-2",
      };

      registerOverlay(element, config1);
      registerOverlay(element, config2);

      const retrieved = getOverlayByElement(element);
      assert.strictEqual(retrieved, config2);
      assert.strictEqual(retrieved.options.placement, "bottom-right");
    });
  });

  describe("getOverlayById", () => {
    it("should retrieve overlay by ID", () => {
      const element = document.createElement("button");
      const config = {
        elementId: "test-3",
        options: {},
        targetElement: element,
        overlayId: "overlay-3",
      };

      registerOverlay(element, config);

      const retrieved = getOverlayById("overlay-3");
      assert.strictEqual(retrieved, config);
    });

    it("should return undefined for non-existent ID", () => {
      const retrieved = getOverlayById("non-existent");
      assert.strictEqual(retrieved, undefined);
    });
  });

  describe("getOverlayByElementId", () => {
    it("should retrieve overlay by element ID", () => {
      const element = document.createElement("button");
      const config = {
        elementId: "test-element-4",
        options: {},
        targetElement: element,
        overlayId: "overlay-4",
      };

      registerOverlay(element, config);

      const retrieved = getOverlayByElementId("test-element-4");
      assert.strictEqual(retrieved, config);
    });
  });

  describe("hasOverlay", () => {
    it("should return true for registered element", () => {
      const element = document.createElement("button");
      const config = {
        elementId: "test-5",
        options: {},
        targetElement: element,
        overlayId: "overlay-5",
      };

      registerOverlay(element, config);

      assert.strictEqual(hasOverlay(element), true);
    });

    it("should return false for unregistered element", () => {
      const element = document.createElement("button");
      assert.strictEqual(hasOverlay(element), false);
    });
  });

  describe("unregisterOverlay", () => {
    it("should remove overlay by ID", () => {
      const element = document.createElement("button");
      const config = {
        elementId: "test-6",
        options: {},
        targetElement: element,
        overlayId: "overlay-6",
      };

      registerOverlay(element, config);
      assert.strictEqual(hasOverlay(element), true);

      const removed = unregisterOverlay("overlay-6");
      assert.strictEqual(removed, true);
      assert.strictEqual(hasOverlay(element), false);
    });

    it("should return false for non-existent overlay", () => {
      const removed = unregisterOverlay("non-existent");
      assert.strictEqual(removed, false);
    });
  });

  describe("getAllOverlays", () => {
    it("should return all registered overlays", () => {
      clearAllOverlays();

      const element1 = document.createElement("button");
      const element2 = document.createElement("input");

      const config1 = {
        elementId: "test-7",
        options: {},
        targetElement: element1,
        overlayId: "overlay-7",
      };

      const config2 = {
        elementId: "test-8",
        options: {},
        targetElement: element2,
        overlayId: "overlay-8",
      };

      registerOverlay(element1, config1);
      registerOverlay(element2, config2);

      const all = getAllOverlays();
      assert.strictEqual(all.length, 2);
      assert.ok(all.includes(config1));
      assert.ok(all.includes(config2));
    });
  });

  describe("updateOverlay", () => {
    it("should update overlay configuration", () => {
      const element = document.createElement("button");
      const config = {
        elementId: "test-9",
        options: { placement: "top-left" },
        targetElement: element,
        overlayId: "overlay-9",
      };

      registerOverlay(element, config);

      const updated = updateOverlay("overlay-9", {
        options: { placement: "bottom-right" },
      });

      assert.strictEqual(updated, true);

      const retrieved = getOverlayById("overlay-9");
      assert.strictEqual(retrieved.options.placement, "bottom-right");
    });

    it("should return false for non-existent overlay", () => {
      const updated = updateOverlay("non-existent", { options: {} });
      assert.strictEqual(updated, false);
    });
  });

  describe("clearAllOverlays", () => {
    it("should remove all overlays", () => {
      // Clear first to ensure clean state
      clearAllOverlays();

      const element1 = document.createElement("button");
      const element2 = document.createElement("input");

      const config1 = {
        elementId: "test-10",
        options: {},
        targetElement: element1,
        overlayId: "overlay-10",
      };

      const config2 = {
        elementId: "test-11",
        options: {},
        targetElement: element2,
        overlayId: "overlay-11",
      };

      registerOverlay(element1, config1);
      registerOverlay(element2, config2);

      assert.strictEqual(getAllOverlays().length, 2);

      clearAllOverlays();

      assert.strictEqual(getAllOverlays().length, 0);
      assert.strictEqual(getOverlayById("overlay-10"), undefined);
      assert.strictEqual(getOverlayById("overlay-11"), undefined);
    });
  });
});
