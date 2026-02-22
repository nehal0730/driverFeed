/**
 * Alert API
 * Endpoints for alerts and notifications
 */

import apiClient from './client.js';

export const alertAPI = {
  /**
   * Get alerts (paginated)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise}
   */
  getAlerts: (page = 1, limit = 20) =>
    apiClient.get('/alerts', { params: { page, limit } }),

  /**
   * Get single alert
   * @param {string} id - Alert ID
   * @returns {Promise}
   */
  getAlert: (id) =>
    apiClient.get(`/alerts/${id}`),

  /**
   * Mark alert as read
   * @param {string} id - Alert ID
   * @returns {Promise}
   */
  markAsRead: (id) =>
    apiClient.patch(`/alerts/${id}/read`),

  /**
   * Mark all alerts as read
   * @returns {Promise}
   */
  markAllAsRead: () =>
    apiClient.post('/alerts/mark-all-read'),

  /**
   * Delete alert
   * @param {string} id - Alert ID
   * @returns {Promise}
   */
  deleteAlert: (id) =>
    apiClient.delete(`/alerts/${id}`),

  /**
   * Clear all alerts
   * @returns {Promise}
   */
  clearAll: () =>
    apiClient.post('/alerts/clear-all'),

  /**
   * Get unread count
   * @returns {Promise}
   */
  getUnreadCount: () =>
    apiClient.get('/alerts/unread-count'),
};
