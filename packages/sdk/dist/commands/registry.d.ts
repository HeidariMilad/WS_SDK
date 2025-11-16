import type { CommandDispatcher } from "../core/command-pipeline/dispatcher";
import type { NavigationRouter } from "./navigate";
/**
 * Register all command handlers with the dispatcher.
 *
 * Registers: navigate, refresh_element, highlight, hover, focus, scroll
 *
 * @param dispatcher - Command dispatcher instance
 * @param router - Optional navigation router (required for navigate command)
 * @returns Cleanup function to unregister all handlers
 */
export declare function registerCommandHandlers(dispatcher: CommandDispatcher, router?: NavigationRouter): () => void;
//# sourceMappingURL=registry.d.ts.map