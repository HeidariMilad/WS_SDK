const { test } = require("node:test");
const assert = require("node:assert/strict");

// NOTE: Tests expect `npm run build` (tsc) to have been executed so that
// dist/core/connection/backoff.js exists.
const { getBackoffDelayMs, getDefaultDelaysMs } = require("../dist/core/connection/backoff.js");

const DEFAULT_DELAYS = getDefaultDelaysMs();

test("backoff delays follow 1s, 2s, 3s cap", () => {
  assert.deepEqual(DEFAULT_DELAYS, [1000, 2000, 3000]);

  assert.equal(getBackoffDelayMs(0, DEFAULT_DELAYS), 1000);
  assert.equal(getBackoffDelayMs(1, DEFAULT_DELAYS), 2000);
  assert.equal(getBackoffDelayMs(2, DEFAULT_DELAYS), 3000);
  // Subsequent attempts should remain capped at 3s.
  assert.equal(getBackoffDelayMs(3, DEFAULT_DELAYS), 3000);
  assert.equal(getBackoffDelayMs(10, DEFAULT_DELAYS), 3000);
});

test("backoff clamps negative attempts to first delay", () => {
  assert.equal(getBackoffDelayMs(-1, DEFAULT_DELAYS), 1000);
});
