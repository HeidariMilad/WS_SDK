const { test } = require("node:test");
const assert = require("node:assert/strict");

const { WebSocketConnection } = require("../dist/core/connection/webSocketConnection.js");
const { LoggingBus } = require("../dist/logging/loggingBus.js");

class FakeWebSocket {
  constructor(url) {
    this.url = url;
    this.CONNECTING = 0;
    this.OPEN = 1;
    this.CLOSING = 2;
    this.CLOSED = 3;

    this.readyState = this.CONNECTING;

    this.onopen = null;
    this.onclose = null;
    this.onerror = null;
    this.onmessage = null;

    this.sent = [];
  }

  close(code, reason) {
    this.readyState = this.CLOSED;
    if (this.onclose) {
      this.onclose({ code, reason });
    }
  }

  send(data) {
    this.sent.push(data);
  }
}

function createConnection({ isOnline = () => true } = {}) {
  const loggingBus = new LoggingBus(100);
  /** @type {FakeWebSocket | null} */
  let lastSocket = null;

  const statusChanges = [];
  const errorEvents = [];

  const connection = new WebSocketConnection({
    url: "ws://test",
    loggingBus,
    isOnline,
    webSocketFactory: (url) => {
      lastSocket = new FakeWebSocket(url);
      return lastSocket;
    },
    onStatusChange: (state) => {
      statusChanges.push(state.status);
    },
    onError: (result) => {
      errorEvents.push(result);
    },
  });

  const loggedEntries = [];
  loggingBus.subscribe((entry) => {
    loggedEntries.push(entry);
  });

  return { connection, loggingBus, statusChanges, errorEvents, loggedEntries, getSocket: () => lastSocket };
}

test("connection transitions from connecting to connected and logs status", () => {
  const { connection, statusChanges, loggedEntries, getSocket } = createConnection();

  connection.connect();

  const socket = getSocket();
  assert.ok(socket, "expected a WebSocket instance to be created");

  // After connect(), we should be in "connecting" state.
  assert.equal(connection.getState().status, "connecting");

  // Simulate successful open from server.
  socket.readyState = socket.OPEN;
  socket.onopen && socket.onopen({});

  assert.equal(connection.getState().status, "connected");

  // Status changes should have recorded the transition.
  assert.deepEqual(statusChanges, ["connecting", "connected"]);

  const statusMessages = loggedEntries
    .filter((e) => e.category === "connection" && e.severity === "info")
    .map((e) => e.message);

  assert.ok(
    statusMessages.includes("Connection status changed to connecting"),
    "expected log for connecting status",
  );
  assert.ok(
    statusMessages.includes("Connection status changed to connected"),
    "expected log for connected status",
  );
});

test("server close triggers reconnecting status and logs reconnect attempt", () => {
  const { connection, statusChanges, loggedEntries, getSocket } = createConnection();

  connection.connect();
  const socket = getSocket();
  assert.ok(socket, "expected a WebSocket instance to be created");

  // Move to connected first.
  socket.readyState = socket.OPEN;
  socket.onopen && socket.onopen({});

  // Now simulate server-initiated close while still online.
  socket.onclose && socket.onclose({ code: 1006, reason: "server down" });

  // We should have transitioned through reconnecting.
  assert.equal(connection.getState().status, "reconnecting");
  assert.ok(statusChanges.includes("reconnecting"));

  const reconnectMessages = loggedEntries
    .filter((e) => e.category === "connection" && e.message.startsWith("Reconnecting in "))
    .map((e) => e.message);

  assert.ok(
    reconnectMessages.length >= 1,
    "expected at least one reconnect log entry after server close",
  );
});

test("manual disconnect transitions to offline without reconnect", async () => {
  const { connection, statusChanges, getSocket } = createConnection();

  connection.connect();
  const socket = getSocket();
  assert.ok(socket, "expected a WebSocket instance to be created");

  socket.readyState = socket.OPEN;
  socket.onopen && socket.onopen({});

  // Manual disconnect should set manualDisconnect flag and result in offline state.
  connection.disconnect({ reason: "user requested" });

  assert.equal(connection.getState().status, "offline");
  assert.ok(statusChanges.includes("offline"));
});

test("sending when not connected produces structured error event and log entry", () => {
  const { connection, errorEvents, loggedEntries } = createConnection();

  const payload = { command: "TEST", requestId: "req-1" };

  // No connect() call – socket is null, so sendCommand should report an error.
  connection.sendCommand(payload);

  assert.equal(errorEvents.length, 1, "expected a single error event from sendCommand");
  const result = errorEvents[0];

  assert.equal(result.status, "error");
  assert.equal(result.requestId, "req-1");
  assert.equal(result.source, "connection");
  assert.match(result.details, /Connection is not open/);

  const errorLogs = loggedEntries.filter(
    (e) => e.category === "connection" && e.severity === "error" && e.message.includes("Connection is not open"),
  );
  assert.ok(errorLogs.length >= 1, "expected an error log entry for closed connection send");
});

test("WebSocket onerror path produces error event and log entry", () => {
  const { connection, errorEvents, loggedEntries, getSocket } = createConnection();

  connection.connect();
  const socket = getSocket();
  assert.ok(socket, "expected a WebSocket instance to be created");

  // Move to connected.
  socket.readyState = socket.OPEN;
  socket.onopen && socket.onopen({});

  // Simulate a low-level WebSocket error.
  socket.onerror && socket.onerror({});

  assert.ok(errorEvents.length >= 1, "expected at least one error event from socket error");
  const result = errorEvents[0];

  assert.equal(result.status, "error");
  assert.equal(result.source, "connection");
  assert.match(result.details, /WebSocket error/);

  const errorLogs = loggedEntries.filter(
    (e) => e.category === "connection" && e.severity === "error" && e.message.includes("WebSocket error"),
  );
  assert.ok(errorLogs.length >= 1, "expected error log entry for WebSocket error");
});
