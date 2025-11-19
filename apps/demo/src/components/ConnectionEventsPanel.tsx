import React, { useEffect, useState } from 'react';
import type { LogEntry } from '@frontend-ui-command-sdk/sdk';
import { globalLoggingBus } from '@frontend-ui-command-sdk/sdk';

export const ConnectionEventsPanel: React.FC = () => {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Seed from existing history so the panel is immediately useful.
    setEntries(globalLoggingBus.getHistory().filter(entry => entry.category === 'connection'));

    const unsubscribe = globalLoggingBus.subscribe(entry => {
      if (entry.category !== 'connection') return;
      setEntries(prev => {
        const next = [entry, ...prev]; // Add to beginning (newest first)
        // Keep a small rolling window for the panel.
        if (next.length > 50) {
          next.pop(); // Remove from end
        }
        return next;
      });
    });

    return unsubscribe;
  }, []);

  // Auto-scroll to top when new entries arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [entries]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '0.75rem 1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        backgroundColor: '#f9fafb',
      }}
    >
      <h2 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', flexShrink: 0 }}>
        Connection Events
      </h2>
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '0.5rem',
        }}
      >
        <ul
          style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.75rem', color: '#4b5563' }}
        >
          {entries.map(entry => (
            <li key={entry.id} style={{ marginBottom: '0.25rem' }}>
              <span style={{ opacity: 0.8 }}>{new Date(entry.timestamp).toLocaleTimeString()} ·</span>{' '}
              <span>{entry.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
