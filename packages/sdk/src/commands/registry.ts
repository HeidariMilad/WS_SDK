import type { CommandDispatcher } from "../core/command-pipeline/dispatcher";
import type { NavigationRouter } from "./navigate";
import { handleNavigate, registerNavigationRouter } from "./navigate";
import { handleRefreshElement } from "./refresh-element";
import { handleHighlight } from "./highlight";
import { handleHover } from "./hover";
import { handleFocus } from "./focus";
import { handleScroll } from "./scroll";
import { handleClick } from "./click";
import { handleFill } from "./fill";
import { handleClear } from "./clear";
import { handleSelect } from "./select";
import { handleOpen, handleClose } from "./open-close";
import { globalLoggingBus } from "../logging/loggingBus";

/**
 * Register all command handlers with the dispatcher.
 *
 * Registers: navigate, refresh_element, highlight, hover, focus, scroll, click, fill, clear, select, open, close
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

  // Register click command
  const unregisterClick = dispatcher.register("click", (payload) => {
    handleClick(payload)
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
          message: "click handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterClick);

  // Register fill command
  const unregisterFill = dispatcher.register("fill", (payload) => {
    handleFill(payload)
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
          message: "fill handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterFill);

  // Register clear command
  const unregisterClear = dispatcher.register("clear", (payload) => {
    handleClear(payload)
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
          message: "clear handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterClear);

  // Register select command
  const unregisterSelect = dispatcher.register("select", (payload) => {
    handleSelect(payload)
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
          message: "select handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterSelect);

  // Register open command
  const unregisterOpen = dispatcher.register("open", (payload) => {
    handleOpen(payload)
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
          message: "open handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterOpen);

  // Register close command
  const unregisterClose = dispatcher.register("close", (payload) => {
    handleClose(payload)
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
          message: "close handler threw unexpected error",
          metadata: {
            payload,
            error: error instanceof Error ? error.message : String(error),
          },
        });
      });
  });
  unregisterFns.push(unregisterClose);

  // Return cleanup function
  return () => {
    unregisterFns.forEach((fn) => fn());
  };
}
