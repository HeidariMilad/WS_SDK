import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CommandResult } from "@frontend-ui-command-sdk/shared";
import type { ConnectionState } from "@frontend-ui-command-sdk/sdk";
import {
  CommandDispatcher,
  createWebSocketCommandClient,
} from "@frontend-ui-command-sdk/sdk";
import { getDemoWebSocketUrl } from "../config/connection";

interface ConnectionContextValue {
  connectionState: ConnectionState;
  lastError?: CommandResult;
  /** Force an immediate reconnect attempt. */
  retry: () => void;
}

const ConnectionContext = createContext<ConnectionContextValue | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatcherRef = useRef<CommandDispatcher>();
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: "offline",
    retryCount: 0,
  });
  const [lastError, setLastError] = useState<CommandResult | undefined>();

  const connectionRef = useRef<ReturnType<typeof createWebSocketCommandClient> | null>(null);

  useEffect(() => {
    const dispatcher = new CommandDispatcher();
    dispatcherRef.current = dispatcher;

    const connection = createWebSocketCommandClient({
      url: getDemoWebSocketUrl(),
      dispatcher,
      onStatusChange: setConnectionState,
      onError: setLastError,
    });

    connectionRef.current = connection;
    connection.connect();

    const unsubscribeStatus = connection.subscribeStatus(setConnectionState);
    const unsubscribeErrors = connection.subscribeErrors((error) => {
      setLastError(error);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeErrors();
      connection.disconnect({ reason: "ConnectionProvider unmounted" });
    };
  }, []);

  const value = useMemo<ConnectionContextValue>(
    () => ({
      connectionState,
      lastError,
      retry: () => {
        connectionRef.current?.connect();
      },
    }),
    [connectionState, lastError],
  );

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};

export function useConnection(): ConnectionContextValue {
  const ctx = useContext(ConnectionContext);
  if (!ctx) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return ctx;
}
