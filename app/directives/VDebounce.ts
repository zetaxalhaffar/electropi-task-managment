/**
 * @description Debounce directive for Vuetify text fields to prevent excessive API calls
 * @param {number | { delay?: number, handler?: Function } | Function} binding.value - Delay in milliseconds, config object, or handler function
 * @param {number} binding.value.delay - Delay in milliseconds (default: 500)
 * @param {Function} binding.value.handler - Optional callback function to execute on debounced input
 * @example
 * // Basic usage with handler function (default 500ms delay)
 * <v-text-field v-debounce="handleSearch" />
 *
 * // Custom delay only
 * <v-text-field v-debounce="300" />
 *
 * // With config object
 * <v-text-field v-debounce="{ delay: 300, handler: handleSearch }" />
 *
 * // Listen to debounced event
 * <v-text-field v-debounce="500" @debounced-input="handleSearch" />
 */

interface DebounceBinding {
  value: number | { delay?: number; handler?: Function } | Function;
}

interface DebounceElement extends HTMLElement {
  _debounceTimeout?: ReturnType<typeof setTimeout>;
  _debounceHandler?: (event: Event) => void;
  _debounceDelay?: number;
  _debounceCallback?: Function | null;
}

const debounceDirective = {
  /**
   * @description Called when the directive is bound to an element
   */
  mounted(el: DebounceElement, binding: DebounceBinding) {
    let delay = 500; // Default delay in milliseconds
    let handler: Function | null = null;

    // Parse binding value
    if (typeof binding.value === "number") {
      delay = binding.value;
    } else if (typeof binding.value === "function") {
      handler = binding.value;
    } else if (typeof binding.value === "object" && binding.value !== null) {
      delay = binding.value.delay ?? 500;
      handler = binding.value.handler ?? null;
    }

    // Store values for cleanup and updates
    el._debounceDelay = delay;
    el._debounceCallback = handler;

    // Find the input element (Vuetify wraps inputs in a div)
    const inputElement = el.querySelector("input") || (el.tagName === "INPUT" ? el : null);

    if (!inputElement) {
      console.warn("[v-debounce] No input element found. Directive may not work correctly.");
      return;
    }

    /**
     * @description Debounced event handler
     */
    const debouncedHandler = (event: Event) => {
      const target = event.target as HTMLInputElement;

      // Clear existing timeout
      if (el._debounceTimeout) {
        clearTimeout(el._debounceTimeout);
      }

      // Set new timeout
      el._debounceTimeout = setTimeout(() => {
        // If handler is provided, call it with the value
        if (el._debounceCallback) {
          el._debounceCallback(target.value, event);
        } else {
          // Otherwise, emit a custom event that can be listened to
          const customEvent = new CustomEvent("debounced-input", {
            detail: {
              value: target.value,
              originalEvent: event,
            },
            bubbles: true,
            cancelable: true,
          });
          el.dispatchEvent(customEvent);
        }
      }, el._debounceDelay);
    };

    // Store handler for cleanup
    el._debounceHandler = debouncedHandler;

    // Add event listener to input element
    inputElement.addEventListener("input", debouncedHandler);
  },

  /**
   * @description Called when the directive is updated
   */
  updated(el: DebounceElement, binding: DebounceBinding) {
    let delay = 500;
    let handler: Function | null = null;

    // Parse binding value
    if (typeof binding.value === "number") {
      delay = binding.value;
    } else if (typeof binding.value === "function") {
      handler = binding.value;
    } else if (typeof binding.value === "object" && binding.value !== null) {
      delay = binding.value.delay ?? 500;
      handler = binding.value.handler ?? null;
    }

    // Only update if values changed
    if (el._debounceDelay !== delay || el._debounceCallback !== handler) {
      // Unmount and remount to apply new binding value
      debounceDirective.unmounted(el);
      debounceDirective.mounted(el, binding);
    }
  },

  /**
   * @description Called when the directive is unbound from an element
   */
  unmounted(el: DebounceElement) {
    // Clear any pending timeout
    if (el._debounceTimeout) {
      clearTimeout(el._debounceTimeout);
      el._debounceTimeout = undefined;
    }

    // Remove event listener
    const inputElement = el.querySelector("input") || (el.tagName === "INPUT" ? el : null);

    if (inputElement && el._debounceHandler) {
      inputElement.removeEventListener("input", el._debounceHandler);
      el._debounceHandler = undefined;
    }

    // Clean up stored values
    el._debounceDelay = undefined;
    el._debounceCallback = undefined;
  },
};

export default debounceDirective;
