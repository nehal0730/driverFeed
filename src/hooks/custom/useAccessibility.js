/**
 * Accessibility-focused Custom Hooks
 * WCAG 2.1 AA compliant
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Keyboard navigation hook
 * Handles arrow key navigation and selection
 * @param {Array} items - Items to navigate
 * @returns {Object} - Navigation state and handlers
 */
export const useKeyboardNav = (items = []) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = useCallback((event) => {
    if (!items.length) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Home':
        event.preventDefault();
        setCurrentIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setCurrentIndex(items.length - 1);
        break;
      default:
        break;
    }
  }, [items.length]);

  return {
    currentIndex,
    setCurrentIndex,
    handleKeyDown,
    currentItem: items[currentIndex] || null,
  };
};

/**
 * Focus management hook
 * Manages focus for accessible interactions
 * @returns {Object} - Focus handlers and refs
 */
export const useFocusManager = () => {
  const focusRef = useRef(null);
  const previousFocusRef = useRef(null);

  const setFocus = useCallback((element) => {
    if (element) {
      element.focus();
    }
  }, []);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement;
  }, []);

  const restoreFocus = useCallback(() => {
    previousFocusRef.current?.focus?.();
  }, []);

  const moveFocusTo = useCallback((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
    }
  }, []);

  return {
    focusRef,
    setFocus,
    saveFocus,
    restoreFocus,
    moveFocusTo,
  };
};

/**
 * ARIA live region announcements
 * Announces changes to assistive technologies
 * @returns {Object} - Announcement handler
 */
export const useAriaAnnounce = () => {
  const [message, setMessage] = useState('');

  const announce = useCallback((text, priority = 'polite') => {
    // Create or update live region
    let liveRegion = document.getElementById('aria-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only'; // Screen reader only class
      document.body.appendChild(liveRegion);
    }

    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = text;
    setMessage(text);

    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
      setMessage('');
    }, 1000);
  }, []);

  return { announce, message };
};

/**
 * Skip to main content functionality
 * Allows keyboard users to skip navigation
 * @returns {Object} - Skip link handlers
 */
export const useSkipToMain = () => {
  const handleSkipToMain = useCallback(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  }, []);

  return { handleSkipToMain };
};
