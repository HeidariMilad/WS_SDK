const { test, describe, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

// Mock window object for Node.js environment
if (typeof window === "undefined") {
  global.window = {
    innerWidth: 1024,
    innerHeight: 768,
  };
  global.navigator = {
    userAgent: "Node.js Test",
  };
}

// NOTE: Tests expect `npm run build` (tsc) to have been executed.
const {
  setChatbotBridge,
  getChatbotBridge,
  handleAIButtonClick,
} = require("../dist/ai-overlay/promptWorkflow.js");

const { requestAiPrompt } = require("../dist/ai-overlay/promptClient.js");

// Mock fetch for prompt API
let fetchMock = null;
const originalFetch = global.fetch;

function resetFetchMock() {
  fetchMock = null;
  global.fetch = originalFetch;
}

function setFetchMock(implementation) {
  fetchMock = implementation;
  global.fetch = async (...args) => {
    return await fetchMock(...args);
  };
}

describe("Chatbot Bridge Integration", () => {
  beforeEach(() => {
    resetFetchMock();
    // Clear any existing bridge
    setChatbotBridge(null);
  });

  describe("setChatbotBridge and getChatbotBridge", () => {
    test("should set and retrieve chatbot bridge", () => {
      const mockBridge = {
        open: () => {},
        close: () => {},
        receivePrompt: () => {},
      };

      setChatbotBridge(mockBridge);
      const retrieved = getChatbotBridge();

      assert.strictEqual(retrieved, mockBridge);
    });

    test("should return null when no bridge is set", () => {
      const bridge = getChatbotBridge();
      assert.strictEqual(bridge, null);
    });

    test("should allow replacing the bridge", () => {
      const bridge1 = {
        open: () => {},
        close: () => {},
        receivePrompt: () => {},
      };
      const bridge2 = {
        open: () => {},
        close: () => {},
        receivePrompt: () => {},
      };

      setChatbotBridge(bridge1);
      assert.strictEqual(getChatbotBridge(), bridge1);

      setChatbotBridge(bridge2);
      assert.strictEqual(getChatbotBridge(), bridge2);
    });
  });

  describe("handleAIButtonClick with chatbot bridge", () => {
    const mockMetadata = {
      elementId: "test-button",
      tagName: "button",
      textContent: "Submit",
      value: "",
      dataAttributes: {},
      computedLabel: "Submit Button",
      boundingBox: { top: 100, left: 200, width: 80, height: 40 },
    };

    const mockPromptResponse = {
      prompt: "How can I help you with this button?",
      timestamp: Date.now(),
      metadata: { suggestions: ["Click", "Hover"] },
    };

    test("should call receivePrompt and open when bridge is set", async () => {
      let receivedData = null;
      let openCalled = false;

      const mockBridge = {
        open: () => {
          openCalled = true;
        },
        close: () => {},
        receivePrompt: (data) => {
          receivedData = data;
        },
      };

      setChatbotBridge(mockBridge);

      setFetchMock(async () => ({
        ok: true,
        json: async () => mockPromptResponse,
      }));

      await handleAIButtonClick(mockMetadata);

      assert.ok(openCalled, "Bridge open() should be called");
      assert.ok(receivedData, "receivePrompt should be called with data");
      assert.equal(receivedData.prompt, mockPromptResponse.prompt);
      assert.equal(receivedData.elementId, mockMetadata.elementId);
      assert.ok(receivedData.requestId, "Should include requestId");
      assert.ok(receivedData.timestamp, "Should include timestamp");
    });

    test("should include extraInfo and metadata in chatbot data", async () => {
      let receivedData = null;

      const mockBridge = {
        open: () => {},
        close: () => {},
        receivePrompt: (data) => {
          receivedData = data;
        },
      };

      setChatbotBridge(mockBridge);

      setFetchMock(async () => ({
        ok: true,
        json: async () => mockPromptResponse,
      }));

      await handleAIButtonClick(mockMetadata);

      assert.ok(receivedData.extraInfo, "Should include extraInfo");
      assert.deepEqual(receivedData.extraInfo, mockPromptResponse.metadata);
      assert.ok(receivedData.metadata, "Should include element metadata");
      assert.equal(receivedData.metadata.elementId, mockMetadata.elementId);
    });

    test("should not throw when bridge is not set", async () => {
      setFetchMock(async () => ({
        ok: true,
        json: async () => mockPromptResponse,
      }));

      // Should complete without error even when no bridge is set
      await handleAIButtonClick(mockMetadata);
      // If we reach here, test passes
      assert.ok(true);
    });

    test("should send error to chatbot on API failure", async () => {
      let receivedData = null;

      const mockBridge = {
        open: () => {},
        close: () => {},
        receivePrompt: (data) => {
          receivedData = data;
        },
      };

      setChatbotBridge(mockBridge);

      setFetchMock(async () => ({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({}),
      }));

      try {
        await handleAIButtonClick(mockMetadata);
        assert.fail("Expected function to throw");
      } catch (error) {
        // Error should be thrown, and error message sent to chatbot
        assert.ok(receivedData, "Should send error to chatbot");
        assert.ok(
          receivedData.prompt.includes("Failed to generate AI prompt"),
          "Should include error message in prompt"
        );
        assert.equal(receivedData.elementId, mockMetadata.elementId);
      }
    });
  });
});
