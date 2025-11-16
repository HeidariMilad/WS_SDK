const { test, describe, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

// NOTE: Tests expect `npm run build` (tsc) to have been executed.
const { requestAiPrompt, PromptApiError } = require("../dist/ai-overlay/promptClient.js");

// Simple manual mock for fetch
let fetchMock = null;
let fetchCallCount = 0;
const originalFetch = global.fetch;

function resetFetchMock() {
  fetchCallCount = 0;
  fetchMock = null;
  global.fetch = originalFetch;
}

function setFetchMock(implementation) {
  fetchMock = implementation;
  global.fetch = async (...args) => {
    fetchCallCount++;
    return await fetchMock(...args);
  };
}

describe("AI Prompt Client", () => {

  describe("requestAiPrompt", () => {
    beforeEach(() => {
      resetFetchMock();
    });
    const mockRequest = {
      metadata: {
        elementId: "test-button",
        tagName: "button",
        textContent: "Submit",
        value: "",
        dataAttributes: {},
        computedLabel: "Submit Button",
        boundingBox: { top: 100, left: 200, width: 80, height: 40 },
      },
      timestamp: Date.now(),
      context: {},
    };

    const mockSuccessResponse = {
      prompt: "How can I help you with this button?",
      timestamp: Date.now(),
      metadata: { suggestions: ["Click", "Hover"] },
    };

    test("should successfully request AI prompt", async () => {
      let capturedUrl, capturedOptions;
      setFetchMock(async (url, options) => {
        capturedUrl = url;
        capturedOptions = options;
        return {
          ok: true,
          json: async () => mockSuccessResponse,
        };
      });

      const result = await requestAiPrompt(mockRequest);

      assert.equal(result.prompt, mockSuccessResponse.prompt);
      assert.equal(typeof result.timestamp, "number");
      assert.deepEqual(result.metadata, mockSuccessResponse.metadata);
      assert.ok(result.requestId.startsWith("prompt_"));

      assert.equal(fetchCallCount, 1);
      assert.equal(capturedUrl, "http://localhost:3000/mock/ai_generate_ui_prompt");
      assert.equal(capturedOptions.method, "POST");
      assert.ok(capturedOptions.headers["X-Request-ID"].startsWith("prompt_"));
    });

    test("should handle 400 error responses", async () => {
      const errorResponse = {
        error: {
          code: "INVALID_REQUEST",
          message: "Missing required field",
          timestamp: new Date().toISOString(),
          requestId: "test-req-123",
        },
      };

      setFetchMock(async () => ({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => errorResponse,
      }));

      try {
        await requestAiPrompt(mockRequest);
        assert.fail("Expected function to throw");
      } catch (error) {
        assert.ok(error instanceof PromptApiError);
        assert.ok(error.message.includes("Missing required field"));
      }
    });

    test("should handle 500 error responses", async () => {
      setFetchMock(async () => ({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({}),
      }));

      await assert.rejects(
        () => requestAiPrompt(mockRequest),
        (error) => error instanceof PromptApiError
      );
    });

    test("should retry once on network failure", async () => {
      let localCallCount = 0;
      setFetchMock(async () => {
        localCallCount++;
        if (localCallCount === 1) {
          throw new Error("Network error");
        }
        return {
          ok: true,
          json: async () => mockSuccessResponse,
        };
      });

      const result = await requestAiPrompt(mockRequest);

      assert.equal(result.prompt, mockSuccessResponse.prompt);
      assert.equal(fetchCallCount, 2);
    });

    test("should fail after retry attempts exhausted", async () => {
      setFetchMock(async () => {
        throw new Error("Network error");
      });

      await assert.rejects(
        () => requestAiPrompt(mockRequest),
        (error) => {
          assert.ok(error.message.includes("Failed to request AI prompt after 2 attempt"));
          return true;
        }
      );
      
      assert.equal(fetchCallCount, 2);
    });

    test("should handle timeout", async () => {
      setFetchMock(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject({ name: "AbortError" }), 1);
          })
      );

      try {
        await requestAiPrompt(mockRequest, { timeoutMs: 1000 });
        assert.fail("Expected function to throw");
      } catch (error) {
        // Timeout errors can be "Request timeout" or AbortError messages
        const msg = error.message.toLowerCase();
        assert.ok(
          msg.includes("timeout") || msg.includes("abort") || msg.includes("failed to request"),
          `Expected timeout-related error, got: ${error.message}`
        );
      }
    });

    test("should respect custom configuration", async () => {
      let capturedUrl;
      setFetchMock(async (url) => {
        capturedUrl = url;
        return {
          ok: true,
          json: async () => mockSuccessResponse,
        };
      });

      const customConfig = {
        baseUrl: "https://custom-api.example.com",
        enableRetry: false,
        retryDelayMs: 1000,
        timeoutMs: 5000,
      };

      await requestAiPrompt(mockRequest, customConfig);

      assert.equal(capturedUrl, "https://custom-api.example.com/mock/ai_generate_ui_prompt");
    });

    test("should normalize response with default timestamp if missing", async () => {
      const responseWithoutTimestamp = {
        prompt: "Test prompt",
        metadata: {},
      };

      setFetchMock(async () => ({
        ok: true,
        json: async () => responseWithoutTimestamp,
      }));

      const result = await requestAiPrompt(mockRequest);

      assert.ok(result.timestamp);
      assert.equal(typeof result.timestamp, "number");
    });

    test("should normalize response with default metadata if missing", async () => {
      const responseWithoutMetadata = {
        prompt: "Test prompt",
        timestamp: Date.now(),
      };

      setFetchMock(async () => ({
        ok: true,
        json: async () => responseWithoutMetadata,
      }));

      const result = await requestAiPrompt(mockRequest);

      assert.deepEqual(result.metadata, {});
    });

    test("should attach unique requestId to each request", async () => {
      setFetchMock(async () => ({
        ok: true,
        json: async () => mockSuccessResponse,
      }));

      const result1 = await requestAiPrompt(mockRequest);
      const result2 = await requestAiPrompt(mockRequest);

      assert.notEqual(result1.requestId, result2.requestId);
    });

    test("should disable retry when enableRetry is false", async () => {
      setFetchMock(async () => {
        throw new Error("Network error");
      });

      await assert.rejects(() =>
        requestAiPrompt(mockRequest, { enableRetry: false })
      );

      assert.equal(fetchCallCount, 1);
    });
  });

  describe("PromptApiError", () => {
    test("should create error with all properties", () => {
      const error = new PromptApiError(
        "Test error",
        400,
        "req-123",
        { detail: "Extra info" }
      );

      assert.equal(error.message, "Test error");
      assert.equal(error.statusCode, 400);
      assert.equal(error.requestId, "req-123");
      assert.deepEqual(error.details, { detail: "Extra info" });
      assert.equal(error.name, "PromptApiError");
    });
  });
});
