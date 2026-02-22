/**
 * Enhanced Accessibility Utilities
 * WCAG 2.1 AA Compliance Helpers
 */

/**
 * Create unique ID for ARIA attributes
 * @param {string} prefix - Prefix for ID
 * @returns {string}
 */
export const createAriaId = (prefix = 'aria') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if element is visible to screen readers
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export const isAccessible = (element) => {
  if (!element) return false;

  const style = window.getComputedStyle(element);
  const ariaHidden = element.getAttribute('aria-hidden');

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    ariaHidden !== 'true'
  );
};

/**
 * Get accessible label for element
 * @param {HTMLElement} element
 * @returns {string}
 */
export const getAccessibleLabel = (element) => {
  if (!element) return '';

  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check for aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    return label?.textContent || '';
  }

  // Check for associated label
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent;
  }

  // Fall back to text content
  return element.textContent;
};

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  let region = document.querySelector('[role="status"]');

  if (!region) {
    region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }

  region.setAttribute('aria-live', priority);
  region.textContent = message;

  setTimeout(() => {
    region.textContent = '';
  }, 1500);
};

/**
 * Check color contrast ratio
 * Returns WCAG level (AA, AAA, or FAIL)
 * @param {string} foreground - Hex color
 * @param {string} background - Hex color
 * @returns {string}
 */
export const getContrastLevel = (foreground, background) => {
  const getLuminance = (hex) => {
    const {r, g, b} = hexToRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'FAIL';
};

/**
 * Create skip navigation link
 * @param {string} targetId - ID of main content
 * @returns {HTMLElement}
 */
export const createSkipLink = (targetId) => {
  const link = document.createElement('a');
  link.href = `#${targetId}`;
  link.textContent = 'Skip to main content';
  link.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white';

  return link;
};

/**
 * Validate form accessibility
 * @param {HTMLFormElement} form
 * @returns {Array} - Array of accessibility issues
 */
export const validateFormAccessibility = (form) => {
  const issues = [];
  const inputs = form.querySelectorAll('input, textarea, select');

  inputs.forEach((input) => {
    // Check for label
    if (!input.getAttribute('aria-label') && !input.id) {
      issues.push(`No label for ${input.name || input.type}`);
    }

    // Check for required fields
    if (input.required && !input.getAttribute('aria-required')) {
      issues.push(`Missing aria-required for ${input.name || input.type}`);
    }

    // Check for error messaging
    if (input.getAttribute('aria-invalid') === 'true' && !input.getAttribute('aria-describedby')) {
      issues.push(`No error message for ${input.name || input.type}`);
    }
  });

  return issues;
};

/**
 * Keyboard shortcut helper
 * @param {string} key - Key combination (e.g., 'Ctrl+S')
 * @param {Function} callback - Function to execute
 * @returns {Function} - Cleanup function
 */
export const createKeyboardShortcut = (key, callback) => {
  const keys = key.split('+');
  const isMod = keys.includes('Ctrl') || keys.includes('Meta') || keys.includes('Shift') || keys.includes('Alt');

  const handler = (event) => {
    const keyPressed = event.key.toLowerCase();
    const mainKey = keys[keys.length - 1].toLowerCase();

    if (keyPressed === mainKey) {
      let isMatch = true;

      if (keys.includes('Ctrl')) isMatch = isMatch && (event.ctrlKey || event.metaKey);
      if (keys.includes('Shift')) isMatch = isMatch && event.shiftKey;
      if (keys.includes('Alt')) isMatch = isMatch && event.altKey;

      if (isMatch) {
        event.preventDefault();
        callback();
      }
    }
  };

  window.addEventListener('keydown', handler);

  // Return cleanup function
  return () => window.removeEventListener('keydown', handler);
};

/**
 * Test keyboard navigation
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export const isKeyboardNavigable = (element) => {
  const tabIndex = element.getAttribute('tabindex');
  const isButton = element.tagName === 'BUTTON';
  const isLink = element.tagName === 'A' && element.href;
  const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName);

  return isButton || isLink || isInput || (tabIndex && tabIndex >= 0);
};
