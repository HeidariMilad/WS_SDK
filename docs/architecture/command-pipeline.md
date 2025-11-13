# WebSocket Command Pipeline

```mermaid
sequenceDiagram
    participant WS as Mock WS Server
    participant SDK as SDK Connection
    participant DISP as Dispatcher
    participant TGT as Target Resolver
    participant CMD as Command Handler
    participant UI as Demo UI

    WS-›SDK: {command, elementId, payload}
    SDK-›DISP: emit("message", data)
    DISP-›TGT: resolve(elementId, selector?)
    TGT--›DISP: element | null, warnings
    alt element found
        DISP-›CMD: execute handler(element, payload)
        CMD-›UI: apply DOM/state effect
        CMD-›SDK: success event
    else element missing
        DISP-›SDK: warning event (ELEMENT_NOT_FOUND)
    end
    SDK-›UI: push structured log entry
```

- **Retries:** Dispatcher retries handler execution for transient DOM issues (max 2 attempts, 150 ms apart) before warning.
- **Publishing:** All events (success/warning/error) include timestamp, payload summary, and `requestId` to aid debugging.
- **Graceful Degradation:** Unknown commands log as `UNHANDLED_COMMAND` without breaking the stream.
