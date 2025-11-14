import type { CommandPayload } from "@frontend-ui-command-sdk/shared";
import { globalLoggingBus } from "../../logging/loggingBus";

export type CommandHandler = (payload: CommandPayload) => void;

/**
 * Minimal command dispatcher used by the WebSocket command pipeline.
 *
 * - Routes CommandPayloads to handlers based on `command`.
 * - Logs UNHANDLED_COMMAND warnings instead of throwing.
 * - Catches handler errors and logs them as non-fatal issues.
 */
export class CommandDispatcher {
  private readonly handlers = new Map<string, CommandHandler[]>();

  register(command: string, handler: CommandHandler): () => void {
    const existing = this.handlers.get(command) ?? [];
    existing.push(handler);
    this.handlers.set(command, existing);

    return () => {
      const current = this.handlers.get(command);
      if (!current) return;
      const index = current.indexOf(handler);
      if (index >= 0) {
        current.splice(index, 1);
      }
      if (current.length === 0) {
        this.handlers.delete(command);
      }
    };
  }

  dispatch(payload: CommandPayload): void {
    const handlers = this.handlers.get(payload.command);
    if (!handlers || handlers.length === 0) {
      globalLoggingBus.log({
        severity: "warning",
        category: "command",
        message: "UNHANDLED_COMMAND: no handler registered",
        metadata: { payload },
      });
      return;
    }

    for (const handler of handlers) {
      try {
        handler(payload);
      } catch (error) {
        globalLoggingBus.log({
          severity: "error",
          category: "command",
          message: "Command handler threw",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      }
    }
  }
}
