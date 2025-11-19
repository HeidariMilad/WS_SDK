import React, { useState } from 'react';
import { CommandBuilder } from './components/CommandBuilder';
import { CommandHistory } from './components/CommandHistory';
import { WebSocketMonitor } from './components/WebSocketMonitor';
import { useWebSocket } from './hooks/useWebSocket';
import { useCommandExecutor } from './hooks/useCommandExecutor';

export const App: React.FC = () => {
  
  // Main WebSocket connection for sending commands and monitoring traffic
  const {
    messages,
    isConnected: wsConnected,
    error,
    sendMessage,
    clearMessages,
  } = useWebSocket('ws://localhost:8080');

  // Shared command executor state (history, loading) for builder + history panel
  const { history, isExecuting, executeCommand, clearHistory } = useCommandExecutor(sendMessage);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
              🎛️ Mock Server Manager
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>
              Control Panel for Frontend UI Command SDK
            </p>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            WebSocket: localhost:8080 (commands & monitoring)
          </div>
        </div>
      </header>

      {/* Simple header strip (no tabs) */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 2rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '56px',
          fontSize: '0.875rem',
          color: '#6b7280',
        }}>
          <span><strong>Control Panel</strong> · Manual commands · WebSocket monitor · History</span>
          <span>
            Status:{' '}
            <span style={{ color: wsConnected ? '#16a34a' : '#dc2626' }}>
              {wsConnected ? 'Connected' : 'Disconnected'}
            </span>
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <CommandBuilder
              wsConnected={wsConnected}
              executeCommand={executeCommand}
              isExecuting={isExecuting}
            />
          </div>

          {/* Right Column: WebSocket monitor on top of command history */}
          <div
            style={{
              height: 'calc(100vh - 250px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ flex: '0 0 45%', minHeight: '180px' }}>
              <WebSocketMonitor
                messages={messages}
                isConnected={wsConnected}
                error={error}
                clearMessages={clearMessages}
              />
            </div>
            <div style={{ flex: '1 1 auto', minHeight: '200px' }}>
              <CommandHistory history={history} clearHistory={clearHistory} />
            </div>
          </div>
        </div>
      </main>

      {/* Global Styles */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        button:hover {
          opacity: 0.9;
        }

        button:active {
          transform: scale(0.98);
        }

        *:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default App;
