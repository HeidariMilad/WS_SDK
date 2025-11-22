import React, { useEffect, useState, useRef, useCallback } from 'react';

interface OverlayState {
  type: 'modal' | 'drawer' | null;
  data?: Record<string, unknown>;
}

/**
 * Global Overlay Manager component that listens for sdk-open and sdk-close events
 * and manages generic modal and drawer overlays.
 */
export const GlobalOverlayManager: React.FC = () => {
  const [overlay, setOverlay] = useState<OverlayState>({ type: null });
  const modalRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const { type, data } = customEvent.detail || {};
    
    if (type === 'modal' || type === 'drawer') {
      setOverlay({ type, data });
    }
  }, []);

  const handleClose = useCallback(() => {
    setOverlay({ type: null });
  }, []);

  // Listen for sdk-open and sdk-close events
  useEffect(() => {
    document.addEventListener('sdk-open', handleOpen);
    document.addEventListener('sdk-close', handleClose);

    return () => {
      document.removeEventListener('sdk-open', handleOpen);
      document.removeEventListener('sdk-close', handleClose);
    };
  }, [handleOpen, handleClose]);

  // ESC key handler for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && overlay.type === 'modal') {
        handleClose();
      }
    };

    if (overlay.type === 'modal') {
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [overlay.type, handleClose]);

  // Focus trap for modal
  useEffect(() => {
    if (overlay.type !== 'modal' || !modalRef.current) return;

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
    };
  }, [overlay.type]);

  if (overlay.type === null) {
    return null;
  }

  if (overlay.type === 'modal') {
    const title = (overlay.data?.title as string) || 'Demo Modal';
    const content = (overlay.data?.content as string) || 'This modal was opened via the open command.';

    return (
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="overlay-modal-title"
        tabIndex={-1}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            id="overlay-modal-title"
            style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}
          >
            {title}
          </h2>
          <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '1.5rem' }}>
            {content}
          </p>
          {overlay.data && Object.keys(overlay.data).length > 0 && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.25rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                color: '#6b7280',
              }}
            >
              <strong>Data:</strong> {JSON.stringify(overlay.data, null, 2)}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              onClick={handleClose}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                backgroundColor: 'white',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (overlay.type === 'drawer') {
    const title = (overlay.data?.title as string) || 'Demo Drawer';
    const content = (overlay.data?.content as string) || 'This drawer was opened via the open command.';

    return (
      <>
        {/* Backdrop */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1999,
          }}
          onClick={handleClose}
        />
        {/* Drawer */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="overlay-drawer-title"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100vh',
            backgroundColor: '#ffffff',
            boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #e0e0e0',
            animation: 'slideIn 0.3s ease-in-out',
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
            <h2
              id="overlay-drawer-title"
              style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}
            >
              {title}
            </h2>
            <button
              onClick={handleClose}
              aria-label="Close drawer"
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

          {/* Content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
            }}
          >
            <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '1rem' }}>
              {content}
            </p>
            {overlay.data && Object.keys(overlay.data).length > 0 && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  color: '#6b7280',
                }}
              >
                <strong>Data:</strong> {JSON.stringify(overlay.data, null, 2)}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}</style>
      </>
    );
  }

  return null;
};

