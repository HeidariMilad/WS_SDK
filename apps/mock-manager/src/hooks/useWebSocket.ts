import { useState, useEffect, useCallback, useRef } from 'react';
import type { WebSocketMessage } from '../types/manager.types';

export function useWebSocket(url: string) {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('[Manager WS] Connected to', url);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const message: WebSocketMessage = {
            id: `msg-${Date.now()}-${Math.random()}`,
            direction: 'received',
            timestamp: Date.now(),
            data,
          };
          setMessages((prev) => [...prev, message]);
        } catch (err) {
          console.error('[Manager WS] Failed to parse message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('[Manager WS] Error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('[Manager WS] Disconnected');
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[Manager WS] Attempting to reconnect...');
          connect();
        }, 3000);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        direction: 'sent',
        timestamp: Date.now(),
        data,
      };
      wsRef.current.send(JSON.stringify(data));
      setMessages((prev) => [...prev, message]);
      return true;
    }
    return false;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    messages,
    isConnected,
    error,
    sendMessage,
    clearMessages,
    reconnect: connect,
  };
}
