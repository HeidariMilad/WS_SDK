import React from "react";

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
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "600" }}>
        Interactive Canvas
      </h2>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {/* Highlight test element */}
        <div
          data-elementid="highlight-target"
          style={{
            padding: "1.5rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.5rem",
            backgroundColor: "#f9fafb",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "0.5rem" }}>
            Highlight Target
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            elementId: <code style={{ backgroundColor: "#e5e7eb", padding: "0.125rem 0.25rem" }}>highlight-target</code>
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
            Test the <strong>highlight</strong> command to see a visual glow/border effect.
          </p>
        </div>

        {/* Hover test element */}
        <div
          data-elementid="hover-target"
          className="hover-test"
          style={{
            padding: "1.5rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.5rem",
            backgroundColor: "#f9fafb",
            transition: "all 0.2s ease-in-out",
            cursor: "pointer",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "0.5rem" }}>
            Hover Target
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            elementId: <code style={{ backgroundColor: "#e5e7eb", padding: "0.125rem 0.25rem" }}>hover-target</code>
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
            Test the <strong>hover</strong> command to trigger hover effects programmatically.
          </p>
        </div>

        {/* Focus test element - Button */}
        <button
          data-elementid="focus-target-button"
          style={{
            padding: "1.5rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.5rem",
            backgroundColor: "#f9fafb",
            textAlign: "left",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "0.5rem" }}>
            Focus Target (Button)
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            elementId: <code style={{ backgroundColor: "#e5e7eb", padding: "0.125rem 0.25rem" }}>focus-target-button</code>
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
            Test the <strong>focus</strong> command on a focusable element.
          </p>
        </button>

        {/* Focus test element - Input */}
        <div
          style={{
            padding: "1.5rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.5rem",
            backgroundColor: "#f9fafb",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "0.5rem" }}>
            Focus Target (Input)
          </h3>
          <label style={{ fontSize: "0.875rem", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>
            Test Input:
          </label>
          <input
            type="text"
            data-elementid="focus-target-input"
            placeholder="Focus me programmatically"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
            }}
          />
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
            elementId: <code style={{ backgroundColor: "#e5e7eb", padding: "0.125rem 0.25rem" }}>focus-target-input</code>
          </p>
        </div>

        {/* Scroll test element - positioned further down */}
        <div
          data-elementid="scroll-target"
          style={{
            padding: "1.5rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.5rem",
            backgroundColor: "#f9fafb",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "0.5rem" }}>
            Scroll Target
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            elementId: <code style={{ backgroundColor: "#e5e7eb", padding: "0.125rem 0.25rem" }}>scroll-target</code>
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
            Test the <strong>scroll</strong> command to bring this element into view.
          </p>
        </div>

        {/* Combined test element */}
        <div
          data-elementid="combined-target"
          tabIndex={0}
          style={{
            padding: "1.5rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.5rem",
            backgroundColor: "#f9fafb",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "0.5rem" }}>
            Combined Target
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            elementId: <code style={{ backgroundColor: "#e5e7eb", padding: "0.125rem 0.25rem" }}>combined-target</code>
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
            Test <strong>multiple commands</strong> on this element (focusable via tabindex).
          </p>
        </div>
      </div>

      {/* Spacer to enable scroll testing */}
      <div style={{ height: "100vh", marginTop: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          data-elementid="far-scroll-target"
          style={{
            padding: "2rem",
            border: "3px dashed #9ca3af",
            borderRadius: "0.5rem",
            backgroundColor: "#fef3c7",
            maxWidth: "400px",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            Far Scroll Target
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            elementId: <code style={{ backgroundColor: "#e5e7eb", padding: "0.125rem 0.25rem" }}>far-scroll-target</code>
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
            This element is positioned far down the page to test smooth scrolling behavior.
          </p>
        </div>
      </div>

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
