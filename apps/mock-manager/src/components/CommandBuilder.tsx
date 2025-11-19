import React, { useState } from 'react';
import type { CommandPayload } from '@frontend-ui-command-sdk/shared';
import type { CommandSchema } from '../types/manager.types';

interface CommandBuilderProps {
  wsConnected: boolean;
  executeCommand: (command: CommandPayload) => void;
  isExecuting: boolean;
}

const DEFAULT_COMMANDS: CommandSchema[] = [
  { command: 'click', description: 'Click an element', requiresElementId: true },
  { command: 'fill', description: 'Fill an input field with text', requiresElementId: true },
  { command: 'clear', description: 'Clear an input field', requiresElementId: true },
  { command: 'focus', description: 'Focus on an element', requiresElementId: true },
  { command: 'hover', description: 'Hover over an element', requiresElementId: true },
  { command: 'highlight', description: 'Highlight an element', requiresElementId: true },
  { command: 'scroll', description: 'Scroll to an element', requiresElementId: true },
  { command: 'select', description: 'Select an option from dropdown', requiresElementId: true },
  { command: 'navigate', description: 'Navigate to a URL', requiresElementId: false },
  { command: 'refresh_element', description: 'Refresh element state', requiresElementId: true },
  { command: 'open', description: 'Open a modal or dialog', requiresElementId: true },
  { command: 'close', description: 'Close a modal or dialog', requiresElementId: true },
];

export const CommandBuilder: React.FC<CommandBuilderProps> = ({
  wsConnected,
  executeCommand,
  isExecuting,
}) => {
  const [commands] = useState<CommandSchema[]>(DEFAULT_COMMANDS);
  const [selectedCommand, setSelectedCommand] = useState<string>('click');
  const [elementId, setElementId] = useState<string>('');
  const [payloadJson, setPayloadJson] = useState<string>('{}');
  const [error, setError] = useState<string>('');

  const getPreviewPayload = () => {
    if (!payloadJson.trim()) return undefined;
    try {
      return JSON.parse(payloadJson);
    } catch {
      return '[Invalid JSON]';
    }
  };

  const handleExecute = () => {
    console.log('[CommandBuilder] Execute button clicked');
    console.log('[CommandBuilder] WS Connected:', wsConnected);
    console.log('[CommandBuilder] Selected command:', selectedCommand);
    console.log('[CommandBuilder] Element ID:', elementId);
    console.log('[CommandBuilder] Payload JSON:', payloadJson);
    
    setError('');
    
    if (!wsConnected) {
      console.error('[CommandBuilder] WebSocket not connected!');
      setError('WebSocket not connected. Please check if the WebSocket server is running.');
      return;
    }
    
    try {
      const payload = payloadJson.trim() ? JSON.parse(payloadJson) : undefined;
      
      const command: CommandPayload = {
        command: selectedCommand,
        elementId: elementId || undefined,
        payload,
        requestId: `manual-${Date.now()}`,
      };

      console.log('[CommandBuilder] Executing command:', command);
      executeCommand(command);
      console.log('[CommandBuilder] Command executed successfully');
    } catch (err) {
      console.error('[CommandBuilder] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute command');
    }
  };

  const selectedCommandSchema = commands.find(c => c.command === selectedCommand);

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: 'white',
    }}>
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
        Manual Command Builder
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Command Type
          </label>
          <select
            value={selectedCommand}
            onChange={(e) => setSelectedCommand(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          >
            {commands.map((cmd) => (
              <option key={cmd.command} value={cmd.command}>
                {cmd.command}
              </option>
            ))}
          </select>
          {selectedCommandSchema && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
              {selectedCommandSchema.description}
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Element ID {selectedCommandSchema?.requiresElementId && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <input
            type="text"
            value={elementId}
            onChange={(e) => setElementId(e.target.value)}
            placeholder="e.g., submit-button, username-input"
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
            Payload (JSON)
          </label>
          <textarea
            value={payloadJson}
            onChange={(e) => setPayloadJson(e.target.value)}
            placeholder='{"value": "example", "duration": 2000}'
            rows={4}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              resize: 'vertical',
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleExecute}
          disabled={isExecuting || (selectedCommandSchema?.requiresElementId && !elementId)}
          style={{
            padding: '0.75rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: isExecuting ? 'not-allowed' : 'pointer',
            opacity: isExecuting ? 0.5 : 1,
          }}
        >
          {isExecuting ? 'Executing...' : '⚡ Execute Command'}
        </button>

        <div style={{
          padding: '0.75rem',
          backgroundColor: '#f9fafb',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
        }}>
          <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Preview:</div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify({
              command: selectedCommand,
              elementId: elementId || undefined,
              payload: getPreviewPayload(),
              requestId: 'manual-xxx',
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
