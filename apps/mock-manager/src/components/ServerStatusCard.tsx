import React from 'react';
import { useServerStatus } from '../hooks/useServerStatus';

export const ServerStatusCard: React.FC = () => {
  const { status, isLoading, error } = useServerStatus();

  const formatUptime = (ms?: number) => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: 'white',
    }}>
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
        Server Status
      </h2>

      {isLoading && <div style={{ color: '#6b7280' }}>Loading...</div>}

      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '4px',
        }}>
          {error}
        </div>
      )}

      {status && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: status.status === 'online' ? '#10b981' : '#ef4444',
              }}
            />
            <span style={{ fontWeight: 500 }}>
              {status.status === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div>
              <div style={{ color: '#6b7280' }}>Uptime</div>
              <div style={{ fontWeight: 500 }}>{formatUptime(status.uptime)}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280' }}>Active Connections</div>
              <div style={{ fontWeight: 500 }}>{status.activeConnections}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280' }}>Commands Sent</div>
              <div style={{ fontWeight: 500 }}>{status.totalCommandsSent}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280' }}>Last Updated</div>
              <div style={{ fontWeight: 500, fontSize: '0.75rem' }}>
                {new Date(status.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
