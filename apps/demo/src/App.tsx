import React from 'react';
import { ConnectionProvider } from './connection/ConnectionContext';
import { ConnectionBanner } from './components/ConnectionBanner';
import { ConnectionEventsPanel } from './components/ConnectionEventsPanel';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { CommandTimeline } from './components/CommandTimeline';

export const App: React.FC = () => {
  return (
    <ConnectionProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Skip navigation for accessibility */}
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            left: '-9999px',
            zIndex: 999,
            padding: '1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.25rem',
          }}
          onFocus={e => {
            e.currentTarget.style.left = '1rem';
            e.currentTarget.style.top = '1rem';
          }}
          onBlur={e => {
            e.currentTarget.style.left = '-9999px';
          }}
        >
          Skip to main content
        </a>

        {/* Status & Controls Bar */}
        <header role="banner" aria-label="Application status and controls">
          <ConnectionBanner />
          <ConnectionEventsPanel />
        </header>

        {/* Command Event Stream */}
        <aside
          role="complementary"
          aria-label="Command event stream"
          style={{
            borderTop: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <CommandTimeline />
        </aside>

        {/* Main Interactive Canvas */}
        <main
          id="main-content"
          role="main"
          aria-label="Interactive demo canvas"
          style={{ flex: 1 }}
        >
          <InteractiveCanvas />
        </main>

        {/* Chatbot Drawer */}
        <ChatbotDrawer />

        {/* Global styles for responsive behavior */}
        <style>{`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* Responsive breakpoints */
          @media (max-width: 639px) {
            /* Mobile: Stack elements, reduce padding */
            main {
              padding: 1rem !important;
            }
          }

          @media (min-width: 640px) and (max-width: 1023px) {
            /* Tablet: Adjust grid layouts */
            main {
              padding: 1.5rem !important;
            }
          }

          /* Ensure focus outlines are visible */
          *:focus-visible {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
          }

          /* Respect reduced motion preferences */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    </ConnectionProvider>
  );
};

export default App;
