import React from 'react';
import { useConnection } from '../connection/ConnectionContext';

const STATUS_LABELS: Record<string, string> = {
  connecting: 'Connecting to command stream…',
  connected: 'Connected to command stream',
  reconnecting: 'Reconnecting to command stream…',
  offline: 'Offline – command stream unavailable',
};

export const ConnectionBanner: React.FC = () => {
  const { connectionState, lastError, retry } = useConnection();

  const statusLabel = STATUS_LABELS[connectionState.status] ?? connectionState.status;
  const isProblemState =
    connectionState.status === 'reconnecting' || connectionState.status === 'offline';

  return (
    <div
      style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.875rem',
        minHeight: '48px',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        backgroundColor:
          connectionState.status === 'connected'
            ? '#ecfdf3' // green-tinted background
            : isProblemState
              ? '#fef2f2' // red-tinted background
              : '#eff6ff', // blue-tinted background
        color:
          connectionState.status === 'connected'
            ? '#166534'
            : isProblemState
              ? '#b91c1c'
              : '#1d4ed8',
      }}
    >
      <div>
        <strong style={{ marginRight: '0.5rem' }}>{statusLabel}</strong>
        {isProblemState && lastError && <span style={{ opacity: 0.9 }}>({lastError.details})</span>}
      </div>

      <div style={{ width: '70px', display: 'flex', justifyContent: 'flex-end' }}>
        {isProblemState && (
          <button
            type="button"
            onClick={retry}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid currentColor',
              background: 'transparent',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};
