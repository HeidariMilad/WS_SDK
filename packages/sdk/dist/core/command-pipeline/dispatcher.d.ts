import type { CommandPayload } from "@frontend-ui-command-sdk/shared";
export type CommandHandler = (payload: CommandPayload) => void;
/**
 * Minimal command dispatcher used by the WebSocket command pipeline.
 *
 * - Routes CommandPayloads to handlers based on `command`.
 * - Logs UNHANDLED_COMMAND warnings instead of throwing.
 * - Catches handler errors and logs them as non-fatal issues.
 */
export declare class CommandDispatcher {
    private readonly handlers;
    register(command: string, handler: CommandHandler): () => void;
    dispatch(payload: CommandPayload): void;
}
//# sourceMappingURL=dispatcher.d.ts.map