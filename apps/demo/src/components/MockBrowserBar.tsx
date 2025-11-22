import React from 'react';
import { useConnection } from '../connection/ConnectionContext';

/**
 * Mock Browser Bar component to visualize SPA-style navigation.
 * Displays the current URL path that updates when navigate commands are received.
 */
export const MockBrowserBar: React.FC = () => {
  const { currentPath } = useConnection();

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderBottom: '2px solid #e5e7eb',
        marginBottom: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          Current URL:
        </div>
        <div
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            color: '#1f2937',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {currentPath}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            fontStyle: 'italic',
          }}
        >
          (SPA navigation - no reload)
        </div>
      </div>
    </div>
  );
};

