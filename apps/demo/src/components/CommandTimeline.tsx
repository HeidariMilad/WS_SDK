import React, { useEffect, useState } from 'react';
import type { LogEntry } from '@frontend-ui-command-sdk/sdk';
import { globalLoggingBus } from '@frontend-ui-command-sdk/sdk';

export const CommandTimeline: React.FC = () => {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Seed from existing history
    setEntries(globalLoggingBus.getHistory());

    const unsubscribe = globalLoggingBus.subscribe(entry => {
      setEntries(prev => {
        const next = [...prev, entry];
        // Keep a rolling window of 100 entries
        if (next.length > 100) {
          next.shift();
        }
        return next;
      });
    });

    return unsubscribe;
  }, []);

  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;
    return entry.category === filter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return '#dc2626';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      case 'debug':
        return '#6b7280';
      default:
        return '#4b5563';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'connection':
        return '🔌';
      case 'ai-prompt':
        return '🤖';
      case 'chatbot':
        return '💬';
      default:
        return '📝';
    }
  };

  return (
    <section
      style={{
        padding: '1rem',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
      }}
    >
      <div style={{ marginBottom: '0.75rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.25rem',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Command Timeline</h2>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: 'white',
            }}
          >
            <option value="all">All Events</option>
            <option value="connection">Connection</option>
            <option value="ai-prompt">AI Prompts</option>
            <option value="chatbot">Chatbot</option>
          </select>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, lineHeight: '1.4' }}>
          📊 Real-time log of all commands, events, and AI interactions. Filter by category or
          scroll through the event stream.
        </p>
      </div>

      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '0.5rem',
        }}
      >
        {filteredEntries.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#9ca3af',
              padding: '2rem',
              fontSize: '0.875rem',
            }}
          >
            No events yet
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {filteredEntries.map(entry => (
              <li
                key={entry.id}
                style={{
                  marginBottom: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  borderLeft: `3px solid ${getSeverityColor(entry.severity)}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{getCategoryIcon(entry.category)}</span>
                  <span style={{ opacity: 0.7 }}>
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: getSeverityColor(entry.severity),
                      textTransform: 'uppercase',
                      fontSize: '0.625rem',
                    }}
                  >
                    {entry.severity}
                  </span>
                </div>
                <div style={{ color: '#374151', marginLeft: '1.5rem' }}>{entry.message}</div>
                {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                  <div
                    style={{
                      marginTop: '0.25rem',
                      marginLeft: '1.5rem',
                      color: '#6b7280',
                      fontSize: '0.625rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {Object.entries(entry.metadata).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
