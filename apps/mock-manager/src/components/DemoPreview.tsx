import React, { useState } from 'react';

export const DemoPreview: React.FC = () => {
  const [demoUrl, setDemoUrl] = useState('http://localhost:5173');

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
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
          Demo Preview
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="Demo URL"
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          />
          <button
            onClick={() => {
              const iframe = document.getElementById('demo-iframe') as HTMLIFrameElement;
              if (iframe) {
                iframe.src = demoUrl;
              }
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </div>

      <div style={{
        flex: 1,
        border: '2px solid #e5e7eb',
        borderRadius: '4px',
        backgroundColor: '#f9fafb',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <iframe
          id="demo-iframe"
          src={demoUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="Demo Application"
        />
      </div>

      <div style={{
        marginTop: '0.75rem',
        padding: '0.75rem',
        backgroundColor: '#eff6ff',
        borderRadius: '4px',
        fontSize: '0.75rem',
        color: '#1e40af',
      }}>
        💡 <strong>Tip:</strong> Make sure the demo app is running on the specified port.
        Commands executed above will be sent to the demo app via WebSocket.
      </div>
    </div>
  );
};
