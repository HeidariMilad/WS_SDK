import React, { useEffect, useState, useCallback } from 'react';
import { registerRefreshCallback } from '@frontend-ui-command-sdk/sdk';

/**
 * Refresh Target component that demonstrates refresh_element command.
 * Registers a callback that updates when refresh_element command is received.
 */
export const RefreshTarget: React.FC = () => {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setLastRefreshed(new Date());
    setRefreshCount(prev => prev + 1);
    
    // Visual feedback animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  }, []);

  useEffect(() => {
    // Register refresh callback with SDK
    const unregister = registerRefreshCallback('refresh-target', handleRefresh);

    return () => {
      unregister();
    };
  }, [handleRefresh]);

  return (
    <div
      data-elementid="refresh-target"
      style={{
        padding: '1.5rem',
        border: '2px solid #e5e7eb',
        borderRadius: '0.5rem',
        backgroundColor: isRefreshing ? '#dbeafe' : '#f9fafb',
        transition: 'background-color 0.3s ease-in-out',
      }}
    >
      <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
        Refresh Target
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        elementId:{' '}
        <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
          refresh-target
        </code>
      </p>
      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '0.25rem',
        }}
      >
        <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
          <strong>Last Refreshed:</strong>{' '}
          <span style={{ fontFamily: 'monospace' }}>
            {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>
        <div style={{ fontSize: '0.875rem', color: '#374151' }}>
          <strong>Refresh Count:</strong>{' '}
          <span style={{ fontFamily: 'monospace', fontWeight: '600', color: '#2563eb' }}>
            {refreshCount}
          </span>
        </div>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
        Test the <strong>refresh_element</strong> command to see this component re-render
        without a full page reload.
      </p>
    </div>
  );
};

