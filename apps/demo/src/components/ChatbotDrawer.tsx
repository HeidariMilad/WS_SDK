import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatbotPromptData } from '@frontend-ui-command-sdk/shared';

interface TranscriptEntry extends ChatbotPromptData {
  id: string;
  receivedAt: number;
}

export const ChatbotDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap helper
  const trapFocus = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !drawerRef.current) return;

      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [isOpen],
  );

  // ESC key handler
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen],
  );

  // Setup keyboard listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', trapFocus);
      document.addEventListener('keydown', handleEscape);
      // Focus the close button when drawer opens
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', trapFocus);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, trapFocus, handleEscape]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const receivePrompt = useCallback((data: ChatbotPromptData) => {
    const entry: TranscriptEntry = {
      ...data,
      id: `${data.requestId}-${Date.now()}`,
      receivedAt: Date.now(),
    };

    setTranscript(prev => [...prev, entry]);
  }, []);

  // Expose bridge methods via window global for SDK access
  useEffect(() => {
    const bridge = {
      open,
      close,
      receivePrompt,
    };

    // Store bridge on window for SDK to access
    (window as unknown as { __chatbotBridge: typeof bridge }).__chatbotBridge = bridge;

    return () => {
      delete (window as unknown as { __chatbotBridge?: typeof bridge }).__chatbotBridge;
    };
  }, [open, close, receivePrompt]);

  return (
    <>
      {/* Manual toggle button (always visible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 999,
          padding: '12px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
        aria-label="Toggle chatbot"
      >
        💬 {isOpen ? 'Close' : 'Open'} Chat
      </button>

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="AI Chatbot"
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-400px',
          width: '400px',
          height: '100vh',
          backgroundColor: '#ffffff',
          boxShadow: isOpen ? '-4px 0 12px rgba(0,0,0,0.15)' : 'none',
          transition: 'right 0.3s ease-in-out',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #e0e0e0',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>AI Assistant</h2>
          <button
            ref={closeButtonRef}
            onClick={close}
            aria-label="Close chatbot"
            style={{
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Transcript */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {transcript.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: '#999',
                marginTop: '40px',
                fontSize: '14px',
              }}
            >
              No prompts yet. Click an AI button to start!
            </div>
          ) : (
            transcript.map(entry => (
              <div
                key={entry.id}
                style={{
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#333',
                    marginBottom: '8px',
                  }}
                >
                  {entry.prompt}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#666',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div>
                    <strong>Element:</strong> {entry.elementId}
                  </div>
                  <div>
                    <strong>Request ID:</strong> {entry.requestId}
                  </div>
                  {entry.extraInfo && Object.keys(entry.extraInfo).length > 0 && (
                    <div>
                      <strong>Extra Info:</strong> {JSON.stringify(entry.extraInfo)}
                    </div>
                  )}
                  <div>
                    <strong>Time:</strong> {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
