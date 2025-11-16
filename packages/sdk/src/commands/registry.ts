import type { CommandDispatcher } from "../core/command-pipeline/dispatcher";
import type { NavigationRouter } from "./navigate";
import { handleNavigate, registerNavigationRouter } from "./navigate";
import { handleRefreshElement } from "./refresh-element";
import { handleHighlight } from "./highlight";
import { handleHover } from "./hover";
import { handleFocus } from "./focus";
import { handleScroll } from "./scroll";
import { globalLoggingBus } from "../logging/loggingBus";

/**
 * Register all command handlers with the dispatcher.
 *
 * Registers: navigate, refresh_element, highlight, hover, focus, scroll
 *
 * @param dispatcher - Command dispatcher instance
 * @param router - Optional navigation router (required for navigate command)
 * @returns Cleanup function to unregister all handlers
 */
export function registerCommandHandlers(
  dispatcher: CommandDispatcher,
  router?: NavigationRouter
): () => void {
  const unregisterFns: Array<() => void> = [];

  // Register navigate command
  if (router) {
    registerNavigationRouter(router);
  }

  const unregisterNavigate = dispatcher.register("navigate", (payload) => {
    const result = handleNavigate(payload);
    if (result.status === "error" || result.status === "warning") {
      globalLoggingBus.log({
        severity: result.status === "error" ? "error" : "warning",
        category: "command",
        message: result.details,
        result,
        metadata: { payload },
      });
    }
  });
  unregisterFns.push(unregisterNavigate);

  // Register refresh_element command
  const unregisterRefresh = dispatcher.register("refresh_element", (payload) => {
    // handleRefreshElement is async, so we handle the promise
    handleRefreshElement(payload)
      .then((result) => {
        if (result.status === "error" || result.status === "warning") {
          globalLoggingBus.log({
            severity: result.status === "error" ? "error" : "warning",
            category: "command",
            message: result.details,
            result,
            metadata: { payload },
          });
        }
      })
      .catch((error) => {
        globalLoggingBus.log({
          severity: "error",
          category: "command",
          message: "refresh_element handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterRefresh);

  // Register highlight command
  const unregisterHighlight = dispatcher.register("highlight", (payload) => {
    handleHighlight(payload)
      .then((result) => {
        if (result.status === "error" || result.status === "warning") {
          globalLoggingBus.log({
            severity: result.status === "error" ? "error" : "warning",
            category: "command",
            message: result.details,
            result,
            metadata: { payload },
          });
        }
      })
      .catch((error) => {
        globalLoggingBus.log({
          severity: "error",
          category: "command",
          message: "highlight handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterHighlight);

  // Register hover command
  const unregisterHover = dispatcher.register("hover", (payload) => {
    handleHover(payload)
      .then((result) => {
        if (result.status === "error" || result.status === "warning") {
          globalLoggingBus.log({
            severity: result.status === "error" ? "error" : "warning",
            category: "command",
            message: result.details,
            result,
            metadata: { payload },
          });
        }
      })
      .catch((error) => {
        globalLoggingBus.log({
          severity: "error",
          category: "command",
          message: "hover handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterHover);

  // Register focus command
  const unregisterFocus = dispatcher.register("focus", (payload) => {
    handleFocus(payload)
      .then((result) => {
        if (result.status === "error" || result.status === "warning") {
          globalLoggingBus.log({
            severity: result.status === "error" ? "error" : "warning",
            category: "command",
            message: result.details,
            result,
            metadata: { payload },
          });
        }
      })
      .catch((error) => {
        globalLoggingBus.log({
          severity: "error",
          category: "command",
          message: "focus handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterFocus);

  // Register scroll command
  const unregisterScroll = dispatcher.register("scroll", (payload) => {
    handleScroll(payload)
      .then((result) => {
        if (result.status === "error" || result.status === "warning") {
          globalLoggingBus.log({
            severity: result.status === "error" ? "error" : "warning",
            category: "command",
            message: result.details,
            result,
            metadata: { payload },
          });
        }
      })
      .catch((error) => {
        globalLoggingBus.log({
          severity: "error",
          category: "command",
          message: "scroll handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterScroll);

  // Return cleanup function
  return () => {
    unregisterFns.forEach((fn) => fn());
  };
}
