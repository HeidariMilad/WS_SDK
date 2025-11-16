import React, { useEffect, useState } from 'react';
import type { LogEntry } from '@frontend-ui-command-sdk/sdk';
import { globalLoggingBus } from '@frontend-ui-command-sdk/sdk';

export const ConnectionEventsPanel: React.FC = () => {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Seed from existing history so the panel is immediately useful.
    setEntries(globalLoggingBus.getHistory().filter(entry => entry.category === 'connection'));

    const unsubscribe = globalLoggingBus.subscribe(entry => {
      if (entry.category !== 'connection') return;
      setEntries(prev => {
        const next = [...prev, entry];
        // Keep a small rolling window for the panel.
        if (next.length > 50) {
          next.shift();
        }
        return next;
      });
    });

    return unsubscribe;
  }, []);

  if (entries.length === 0) {
    return null;
  }

  return (
    <section style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e5e7eb' }}>
      <h2 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        Connection Events
      </h2>
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
    </section>
  );
};
