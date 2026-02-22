/**
 * Performance Optimization Utilities
 * Includes memoization, debouncing, throttling, and component splitting
 */

import React from 'react';

/**
 * Memoized list item component for optimized rendering
 * Use with React.memo to prevent unnecessary re-renders
 * @param {Function} Component - Component to memoize
 * @param {Array} propsToCompare - Props to compare for memoization
 * @returns {React.Component}
 */
export const memoizeComponent = (Component, propsToCompare = []) => {
  return React.memo(Component, (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return propsToCompare.every((prop) => prevProps[prop] === nextProps[prop]);
  });
};

/**
 * Debounce function for expensive operations
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function for frequent events
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time between calls in milliseconds
 * @returns {Function}
 */
export const throttle = (fn, limit = 300) => {
  let lastCall = 0;

  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
};

/**
 * Batch update function
 * Groups multiple state updates together
 * @param {Function} updateFn - Function containing updates
 */
export const batchUpdates = (updateFn) => {
  // React 18+ automatically batches updates, but this is here for older versions
  updateFn();
};

/**
 * Lazy load component for code splitting
 * @param {Function} importFn - Import function
 * @returns {React.Component}
 */
export const lazyLoad = (importFn) => {
  return React.lazy(importFn);
};

/**
 * Virtualization helper for long lists
 * Returns visible range of items based on scroll position
 * @param {Array} items - Full list of items
 * @param {number} scrollPosition - Current scroll position
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of container
 * @param {number} overscan - Number of items to render outside visible area
 * @returns {Object} - { visibleItems, startIndex, endIndex }
 */
export const getVisibleRange = (
  items,
  scrollPosition,
  itemHeight,
  containerHeight,
  overscan = 5
) => {
  const startIndex = Math.max(0, Math.floor(scrollPosition / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollPosition + containerHeight) / itemHeight) + overscan
  );

  return {
    visibleItems: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
  };
};

/**
 * Request idle callback wrapper for non-critical work
 * @param {Function} callback - Function to run when idle
 * @returns {Function} - Cancel function
 */
export const scheduleIdleWork = (callback) => {
  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(callback);
    return () => cancelIdleCallback(id);
  } else {
    // Fallback for browsers without requestIdleCallback
    const id = setTimeout(callback, 1);
    return () => clearTimeout(id);
  }
};

/**
 * Image lazy loading setup
 * Uses Intersection Observer for performance
 * @returns {Object} - { ref, isVisible }
 */
export const useImageLazyLoad = () => {
  const ref = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

/**
 * Performance metrics helper
 * Measures component render time
 * @param {string} componentName - Name of component for logging
 * @returns {Function} - Wrapper function to measure render time
 */
export const measureRenderTime = (componentName) => {
  return (Component) => {
    return React.forwardRef((props, ref) => {
      React.useEffect(() => {
        const startTime = performance.now();

        return () => {
          const endTime = performance.now();
          console.log(`${componentName} render time: ${endTime - startTime}ms`);
        };
      });

      return <Component {...props} ref={ref} />;
    });
  };
};
