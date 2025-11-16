import React, { useEffect, useState, useRef } from 'react';

/**
 * Interactive Canvas component for testing interaction commands.
 *
 * Provides clearly labeled elements for testing:
 * - highlight command
 * - hover command
 * - focus command
 * - scroll command
 */
export const InteractiveCanvas: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC key handler for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus the modal when it opens
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#eff6ff',
          borderRadius: '0.5rem',
          border: '1px solid #bfdbfe',
        }}
      >
        <h2
          style={{
            marginBottom: '0.75rem',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e40af',
          }}
        >
          Interactive Canvas
        </h2>
        <p
          style={{ fontSize: '1rem', color: '#1e40af', marginBottom: '0.75rem', lineHeight: '1.6' }}
        >
          👋 <strong>Welcome to the Frontend UI Command SDK Demo!</strong> This page demonstrates
          how external commands can control and interact with UI elements remotely.
        </p>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#1e40af',
            marginBottom: '0.5rem',
            lineHeight: '1.6',
          }}
        >
          <strong>How it works:</strong> Each element below is labeled with an{' '}
          <code
            style={{
              backgroundColor: '#dbeafe',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
            }}
          >
            elementId
          </code>
          . Commands sent via WebSocket or manual controls can target these elements to trigger
          actions like click, focus, fill, highlight, and more.
        </p>
        <p style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: '1.6' }}>
          <strong>Watch the timeline:</strong> As commands execute, the Command Timeline below logs
          each action with status, timestamp, and details.
        </p>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          <strong style={{ color: '#1e40af', marginRight: '0.5rem' }}>📚 Documentation:</strong>
          <a
            href="docs/prd.md"
            style={{ color: '#2563eb', textDecoration: 'underline', marginRight: '1rem' }}
          >
            PRD
          </a>
          <a
            href="docs/architecture.md"
            style={{ color: '#2563eb', textDecoration: 'underline', marginRight: '1rem' }}
          >
            Architecture
          </a>
          <a
            href="docs/front-end-spec.md"
            style={{ color: '#2563eb', textDecoration: 'underline' }}
          >
            UX Spec
          </a>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {/* Highlight test element */}
        <div
          data-elementid="highlight-target"
          style={{
            padding: '1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Highlight Target
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            elementId:{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
              highlight-target
            </code>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Test the <strong>highlight</strong> command to see a visual glow/border effect.
          </p>
        </div>

        {/* Hover test element */}
        <div
          data-elementid="hover-target"
          className="hover-test"
          style={{
            padding: '1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Hover Target
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            elementId:{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
              hover-target
            </code>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Test the <strong>hover</strong> command to trigger hover effects programmatically.
          </p>
        </div>

        {/* Focus test element - Button */}
        <button
          data-elementid="focus-target-button"
          style={{
            padding: '1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Focus Target (Button)
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            elementId:{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
              focus-target-button
            </code>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Test the <strong>focus</strong> command on a focusable element.
          </p>
        </button>

        {/* Focus test element - Input */}
        <div
          style={{
            padding: '1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Focus Target (Input)
          </h3>
          <label
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            Test Input:
          </label>
          <input
            type="text"
            data-elementid="focus-target-input"
            placeholder="Focus me programmatically"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
            }}
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            elementId:{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
              focus-target-input
            </code>
          </p>
        </div>

        {/* Scroll test element - positioned further down */}
        <div
          data-elementid="scroll-target"
          style={{
            padding: '1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Scroll Target
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            elementId:{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
              scroll-target
            </code>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Test the <strong>scroll</strong> command to bring this element into view.
          </p>
        </div>

        {/* Combined test element */}
        <div
          data-elementid="combined-target"
          tabIndex={0}
          style={{
            padding: '1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Combined Target
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            elementId:{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
              combined-target
            </code>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Test <strong>multiple commands</strong> on this element (focusable via tabindex).
          </p>
        </div>

        {/* Textarea test element */}
        <div
          style={{
            padding: '1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Textarea Target
          </h3>
          <label
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            Test Textarea:
          </label>
          <textarea
            data-elementid="textarea-target"
            placeholder="Type or fill via command..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            elementId:{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
              textarea-target
            </code>
          </p>
        </div>

        {/* Dropdown/Select test element */}
        <div
          style={{
            padding: '1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Dropdown Target
          </h3>
          <label
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            Test Dropdown:
          </label>
          <select
            data-elementid="dropdown-target"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="">Choose an option...</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            elementId:{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
              dropdown-target
            </code>
          </p>
        </div>

        {/* Modal trigger test element */}
        <div
          style={{
            padding: '1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Modal Target
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
            Test triggering a modal dialog via command.
          </p>
          <button
            data-elementid="modal-trigger"
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #2563eb',
              borderRadius: '0.25rem',
              backgroundColor: '#2563eb',
              color: 'white',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Open Modal
          </button>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            elementId:{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
              modal-trigger
            </code>
          </p>
        </div>
      </div>

      {/* Spacer to enable scroll testing */}
      <div
        style={{
          height: '100vh',
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          data-elementid="far-scroll-target"
          style={{
            padding: '2rem',
            border: '3px dashed #9ca3af',
            borderRadius: '0.5rem',
            backgroundColor: '#fef3c7',
            maxWidth: '400px',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Far Scroll Target
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            elementId:{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
              far-scroll-target
            </code>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            This element is positioned far down the page to test smooth scrolling behavior.
          </p>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          data-elementid="demo-modal"
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
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={e => {
            // Close on backdrop click
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
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
            onClick={e => e.stopPropagation()}
          >
            <h2
              id="demo-modal-title"
              style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}
            >
              Demo Modal
            </h2>
            <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '1.5rem' }}>
              This modal can be triggered by commands. It demonstrates how the SDK can interact with
              overlay components and modal dialogs.
            </p>
            <div
              data-elementid="modal-content"
              style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                elementId:{' '}
                <code style={{ backgroundColor: '#e5e7eb', padding: '0.125rem 0.25rem' }}>
                  modal-content
                </code>
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Commands can target elements inside modals as well.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsModalOpen(false)}
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
                Cancel
              </button>
              <button
                data-elementid="modal-confirm"
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #2563eb',
                  borderRadius: '0.25rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Hover styles for hover-target */
        .hover-test:hover,
        .hover-test.sdk-hover-active {
          background-color: #dbeafe;
          border-color: #3b82f6;
          transform: scale(1.02);
        }

        /* Focus styles */
        button:focus,
        input:focus,
        [tabindex]:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
