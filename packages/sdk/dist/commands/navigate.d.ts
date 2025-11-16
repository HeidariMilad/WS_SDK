import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
/**
 * Navigation router interface compatible with Next.js App Router.
 * This allows the SDK to remain framework-agnostic while supporting Next.js.
 */
export interface NavigationRouter {
    push: (path: string) => void | Promise<void>;
    replace?: (path: string) => void | Promise<void>;
}
/**
 * Register a navigation router (e.g., Next.js useRouter) for the SDK to use.
 * Must be called before navigate commands are dispatched.
 *
 * @param router - Router instance with push/replace methods
 */
export declare function registerNavigationRouter(router: NavigationRouter): void;
/**
 * Unregister the navigation router.
 */
export declare function unregisterNavigationRouter(): void;
/**
 * Navigate command handler.
 *
 * Performs SPA-style navigation using the registered router (e.g., Next.js).
 * Does not trigger full page reloads.
 *
 * Payload format:
 * - `payload.value`: string (destination path)
 * - OR `payload.options.path`: string (destination path)
 * - Optional `payload.options.replace`: boolean (use replace instead of push)
 *
 * @param payload - Command payload
 * @returns CommandResult indicating success or failure
 */
export declare function handleNavigate(payload: CommandPayload): CommandResult;
//# sourceMappingURL=navigate.d.ts.map