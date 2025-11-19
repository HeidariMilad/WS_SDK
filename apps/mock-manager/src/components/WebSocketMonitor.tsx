import React from 'react';
import type { WebSocketMessage } from '../types/manager.types';

interface WebSocketMonitorProps {
  messages: WebSocketMessage[];
  isConnected: boolean;
  error: string | null;
  clearMessages: () => void;
}

export const WebSocketMonitor: React.FC<WebSocketMonitorProps> = ({
  messages,
  isConnected,
  error,
  clearMessages,
}) => {

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            WebSocket Monitor
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isConnected ? '#10b981' : '#ef4444',
              }}
            />
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '4px',
          fontSize: '0.875rem',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        backgroundColor: '#000',
        color: '#22c55e',
        padding: '1rem',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.75rem',
      }}>
        {messages.length === 0 ? (
          <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            No messages yet
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '0.5rem' }}>
              <div style={{
                color: msg.direction === 'sent' ? '#3b82f6' : '#22c55e',
                marginBottom: '0.25rem',
              }}>
                <span style={{ color: '#9ca3af' }}>
                  [{new Date(msg.timestamp).toLocaleTimeString()}]
                </span>{' '}
                {msg.direction === 'sent' ? '→ SENT' : '← RECEIVED'}
              </div>
              <pre style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                paddingLeft: '1.5rem',
              }}>
                {JSON.stringify(msg.data, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
