/**
 * Feature Flag API
 * Endpoints for managing feature flags
 */

import apiClient, { isMockMode } from './client.js';
import { DEFAULT_FEATURE_FLAGS } from '../constants/featureFlagDefaults.js';

export const featureFlagAPI = {
  /**
   * Get all feature flags
   * @returns {Promise}
   */
  getFlags: () =>
    isMockMode()
      ? Promise.resolve(DEFAULT_FEATURE_FLAGS)
      : apiClient.get('/feature-flags'),

  /**
   * Update a single flag
   * @param {string} flag - Flag key
   * @param {boolean} value - New value
   * @returns {Promise}
   */
  updateFlag: (flag, value) =>
    apiClient.patch('/feature-flags', { [flag]: value }),

  /**
   * Update multiple flags
   * @param {Object} flags - Flags to update
   * @returns {Promise}
   */
  updateFlags: (flags) =>
    apiClient.patch('/feature-flags', flags),

  /**
   * Reset flags to defaults
   * @returns {Promise}
   */
  resetFlags: () =>
    apiClient.post('/feature-flags/reset'),
};
