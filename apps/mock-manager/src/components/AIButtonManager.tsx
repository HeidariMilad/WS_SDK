import React, { useState } from 'react';

interface AIButtonManagerProps {
  wsConnected: boolean;
  executeCommand: (command: any) => void;
  isExecuting: boolean;
}

type PlacementType = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export const AIButtonManager: React.FC<AIButtonManagerProps> = ({
  wsConnected,
  executeCommand,
  isExecuting,
}) => {
  const [elementId, setElementId] = useState<string>('');
  const [placement, setPlacement] = useState<PlacementType>('top-right');
  const [label, setLabel] = useState<string>('');
  const [icon, setIcon] = useState<string>('');
  const [size, setSize] = useState<'default' | 'compact'>('default');
  const [backgroundColor, setBackgroundColor] = useState<string>('#2563eb');
  const [borderColor, setBorderColor] = useState<string>('#1e40af');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [offsetX, setOffsetX] = useState<string>('0');
  const [offsetY, setOffsetY] = useState<string>('0');
  const [error, setError] = useState<string>('');

  const handleAttach = () => {
    setError('');

    if (!wsConnected) {
      setError('WebSocket not connected. Please check if the WebSocket server is running.');
      return;
    }

    if (!elementId.trim()) {
      setError('Element ID is required');
      return;
    }

    const options: Record<string, any> = {
      placement,
      size,
      backgroundColor,
      borderColor,
    };

    if (label.trim()) {
      options.label = label.trim();
    }

    if (icon.trim()) {
      options.icon = icon.trim();
    }

    if (width.trim()) {
      const widthNum = parseInt(width, 10);
      if (!isNaN(widthNum) && widthNum > 0) {
        options.width = widthNum;
      }
    }

    if (height.trim()) {
      const heightNum = parseInt(height, 10);
      if (!isNaN(heightNum) && heightNum > 0) {
        options.height = heightNum;
      }
    }

    const offsetXNum = parseInt(offsetX, 10);
    if (!isNaN(offsetXNum)) {
      options.offsetX = offsetXNum;
    }

    const offsetYNum = parseInt(offsetY, 10);
    if (!isNaN(offsetYNum)) {
      options.offsetY = offsetYNum;
    }

    const command = {
      command: 'attach_ai_button',
      elementId: elementId.trim(),
      payload: { options },
      requestId: `attach-ai-${Date.now()}`,
    };

    executeCommand(command);
  };

  const handleDetach = () => {
    setError('');

    if (!wsConnected) {
      setError('WebSocket not connected. Please check if the WebSocket server is running.');
      return;
    }

    if (!elementId.trim()) {
      setError('Element ID is required');
      return;
    }

    const command = {
      command: 'detach_ai_button',
      elementId: elementId.trim(),
      payload: { options: {} },
      requestId: `detach-ai-${Date.now()}`,
    };

    executeCommand(command);
  };

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: 'white',
      }}
    >
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
        AI Button Manager
      </h2>
      <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
        Attach or detach AI assistant buttons to elements in the demo app.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Element ID <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={elementId}
            onChange={(e) => setElementId(e.target.value)}
            placeholder="e.g., submit-button, highlight-target"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Placement
          </label>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value as PlacementType)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          >
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="center">Center</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Size
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as 'default' | 'compact')}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          >
            <option value="default">Default</option>
            <option value="compact">Compact</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Label (optional)
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Ask AI, Help"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          />
          <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
            Tooltip text for the button
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Icon (optional)
          </label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="SVG string or emoji"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          />
          <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
            Leave empty to use default AI icon
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Background Color
            </label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Border Color
            </label>
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Width (px, optional)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="44 (default)"
              min="20"
              max="200"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Height (px, optional)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="44 (default)"
              min="20"
              max="200"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Offset X (px)
            </label>
            <input
              type="number"
              value={offsetX}
              onChange={(e) => setOffsetX(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
            <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
              Positive = right, negative = left
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Offset Y (px)
            </label>
            <input
              type="number"
              value={offsetY}
              onChange={(e) => setOffsetY(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
            <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
              Positive = down, negative = up
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleAttach}
            disabled={isExecuting || !elementId.trim()}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isExecuting || !elementId.trim() ? 'not-allowed' : 'pointer',
              opacity: isExecuting || !elementId.trim() ? 0.5 : 1,
            }}
          >
            {isExecuting ? 'Attaching...' : '✨ Attach AI Button'}
          </button>

          <button
            onClick={handleDetach}
            disabled={isExecuting || !elementId.trim()}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isExecuting || !elementId.trim() ? 'not-allowed' : 'pointer',
              opacity: isExecuting || !elementId.trim() ? 0.5 : 1,
            }}
          >
            {isExecuting ? 'Detaching...' : '🗑️ Detach AI Button'}
          </button>
        </div>

        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#eff6ff',
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: '#1e40af',
            lineHeight: '1.5',
          }}
        >
          <strong>💡 Tips:</strong><br/>
          • AI buttons are now positioned <strong>inside</strong> the element boundaries<br/>
          • Use offsets to fine-tune the position (X for horizontal, Y for vertical)<br/>
          • Buttons automatically reattach when elements are removed and re-added<br/>
          • Click an AI button in the demo to trigger the AI prompt workflow
        </div>
      </div>
    </div>
  );
};

