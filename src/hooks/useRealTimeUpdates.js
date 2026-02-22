/**
 * Real-Time Updates Hook
 * Simple hook for components to use real-time updates
 */

import { useEffect, useRef } from 'react';
import { RealTimeManager } from '../services/realTimeUpdates.js';

/**
 * Hook for real-time updates
 * @param {Object} stores - Zustand stores
 * @param {Object} options - Configuration options
 * @returns {Object} - { isActive, start, stop }
 */
export const useRealTimeUpdates = (stores, options = {}) => {
  const managerRef = useRef(null);

  useEffect(() => {
    if (!options.enabled) {
      return undefined;
    }

    const manager = new RealTimeManager(stores, options);
    managerRef.current = manager;

    if (Array.isArray(options.enabledTypes) && options.enabledTypes.length > 0) {
      options.enabledTypes.forEach((type) => manager.start(type));
    } else {
      manager.startAll();
    }

    return () => {
      manager.destroy();
    };
  }, [stores, options.enabled, options.alertInterval, options.feedbackInterval, options.dashboardInterval, options.enabledTypes]);

  return {
    isActive: true,
    start: (type) => managerRef.current?.start(type),
    stop: (type) => managerRef.current?.stop(type),
  };
};
