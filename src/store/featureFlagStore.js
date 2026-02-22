/**
 * Feature Flag Store using Zustand
 * Manages feature flag state and configuration
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DEFAULT_FEATURE_FLAGS } from '../constants/featureFlagDefaults.js';

/**
 * @typedef {Object} FeatureFlagState
 * @property {Object} flags
 * @property {boolean} loading
 * @property {string|null} error
 * @property {Function} setFlags
 * @property {Function} toggleFlag
 * @property {Function} resetFlags
 * @property {Function} loadFlags
 */

/**
 * Create and export the feature flag store
 */
export const useFeatureFlagStore = create(
  devtools((set) => ({
    flags: DEFAULT_FEATURE_FLAGS,
    loading: false,
    error: null,

    /**
     * Set multiple flags at once
     * @param {Object} partialFlags - Partial flags object to merge
     */
    setFlags: (partialFlags) =>
      set((state) => ({
        flags: { ...state.flags, ...partialFlags },
      })),

    /**
     * Toggle a single flag
     * @param {string} key - Feature flag key
     */
    toggleFlag: (key) =>
      set((state) => ({
        flags: {
          ...state.flags,
          [key]: !state.flags[key],
        },
      })),

    /**
     * Reset flags to defaults
     */
    resetFlags: () => set({ flags: DEFAULT_FEATURE_FLAGS }),

    /**
     * Load flags from API
     * @param {Object} flags - Flags from API
     */
    loadFlags: (flags) => set({ flags, loading: false, error: null }),

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),
  }))
);
