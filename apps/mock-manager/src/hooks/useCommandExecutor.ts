import { useState, useCallback } from 'react';
import type { CommandPayload } from '@frontend-ui-command-sdk/shared';
import type { CommandHistoryEntry } from '../types/manager.types';

export function useCommandExecutor(
  sendMessage: (data: unknown) => boolean,
  onAck?: (requestId: string) => void
) {
  const [history, setHistory] = useState<CommandHistoryEntry[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCommand = useCallback(
    (command: CommandPayload) => {
      console.log('[useCommandExecutor] executeCommand called with:', command);
      setIsExecuting(true);
      const historyEntry: CommandHistoryEntry = {
        id: `hist-${Date.now()}`,
        command,
        timestamp: Date.now(),
        status: 'sent',
      };

      console.log('[useCommandExecutor] Adding to history:', historyEntry);
      setHistory((prev) => [historyEntry, ...prev]);

      try {
        // Send command via WebSocket
        console.log('[useCommandExecutor] Sending via WebSocket...');
        const success = sendMessage({
          type: 'command',
          command,
        });

        console.log('[useCommandExecutor] sendMessage result:', success);

        if (success) {
          // Update history with success (command sent)
          console.log('[useCommandExecutor] Command sent successfully');
          setHistory((prev) =>
            prev.map((entry) =>
              entry.id === historyEntry.id
                ? {
                    ...entry,
                    status: 'success' as const,
                    response: 'Command sent via WebSocket',
                  }
                : entry
            )
          );
        } else {
          // Update history with error (failed to send)
          console.error('[useCommandExecutor] Failed to send command');
          setHistory((prev) =>
            prev.map((entry) =>
              entry.id === historyEntry.id
                ? {
                    ...entry,
                    status: 'error' as const,
                    response: 'WebSocket not connected',
                  }
                : entry
            )
          );
        }
      } catch (error) {
        // Update history with error
        console.error('[useCommandExecutor] Exception:', error);
        setHistory((prev) =>
          prev.map((entry) =>
            entry.id === historyEntry.id
              ? {
                  ...entry,
                  status: 'error' as const,
                  response: error instanceof Error ? error.message : 'Command execution failed',
                }
              : entry
          )
        );
      } finally {
        setIsExecuting(false);
        console.log('[useCommandExecutor] Execution complete');
      }
    },
    [sendMessage]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    isExecuting,
    executeCommand,
    clearHistory,
  };
}
