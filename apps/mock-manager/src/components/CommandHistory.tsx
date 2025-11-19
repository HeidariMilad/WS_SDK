import React from 'react';
import type { CommandHistoryEntry } from '../types/manager.types';

interface CommandHistoryProps {
  history: CommandHistoryEntry[];
  clearHistory: () => void;
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({ history, clearHistory }) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'sent': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'sent': return '⋯';
      default: return '○';
    }
  };

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
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
          Command History
        </h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
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

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {history.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.875rem',
            padding: '2rem',
          }}>
            No commands executed yet
          </div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              style={{
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(entry.status),
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {getStatusIcon(entry.status)}
                </span>
                <span style={{ fontWeight: 600 }}>{entry.command.command}</span>
                {entry.command.elementId && (
                  <span style={{
                    padding: '0.125rem 0.5rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                  }}>
                    {entry.command.elementId}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                {new Date(entry.timestamp).toLocaleTimeString()} • {entry.command.requestId}
              </div>

              {entry.response && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: entry.status === 'error' ? '#fee2e2' : '#f0fdf4',
                  color: entry.status === 'error' ? '#991b1b' : '#166534',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                }}>
                  {entry.response}
                </div>
              )}

              {entry.command.payload && (
                <details style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  <summary style={{ cursor: 'pointer', color: '#6b7280' }}>
                    Payload
                  </summary>
                  <pre style={{
                    marginTop: '0.25rem',
                    padding: '0.5rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.7rem',
                  }}>
                    {JSON.stringify(entry.command.payload, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
