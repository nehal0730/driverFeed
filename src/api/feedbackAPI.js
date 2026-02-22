/**
 * Feedback API
 * Endpoints for feedback submission and retrieval
 */

import apiClient, { isMockMode } from './client.js';

const mockFeedback = [
  {
    id: 'f1',
    entityType: 'driver',
    entityId: 'd1',
    rating: 5,
    tags: ['professional'],
    comment: 'Very polite and safe driver.',
    sentiment: 'positive',
    timestamp: new Date().toISOString(),
    employeeId: 'e1',
  },
  {
    id: 'f2',
    entityType: 'trip',
    entityId: 't1',
    rating: 3,
    tags: ['late'],
    comment: 'Trip was slightly delayed.',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
    employeeId: 'e2',
  },
  {
    id: 'f3',
    entityType: 'driver',
    entityId: 'd3',
    rating: 2,
    tags: ['rash-driving'],
    comment: 'Needs improvement in safety.',
    sentiment: 'negative',
    timestamp: new Date(Date.now() - 7200 * 1000).toISOString(),
    employeeId: 'e3',
  },
];

export const feedbackAPI = {
  /**
   * Submit new feedback
   * @param {Object} data - Feedback data
   * @returns {Promise}
   */
  submitFeedback: (data) =>
    isMockMode()
      ? Promise.resolve({
          id: `f-${Date.now()}`,
          sentiment: (() => {
            const ratings = ['driverRating', 'tripRating', 'appRating', 'marshalRating']
              .map((key) => data[key])
              .filter((value) => typeof value === 'number' && value > 0);
            const avg = ratings.length
              ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length
              : 0;
            if (avg >= 4) return 'positive';
            if (avg >= 3) return 'neutral';
            return 'negative';
          })(),
          timestamp: new Date().toISOString(),
          employeeId: 'mock-employee',
          ...data,
        })
      : apiClient.post('/feedback', data),

  /**
   * Get feedback list (paginated)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise}
   */
  getFeedback: (page = 1, limit = 20) =>
    isMockMode()
      ? Promise.resolve({
          data: mockFeedback.slice(0, limit),
          pagination: { page, limit, total: mockFeedback.length, hasMore: false },
        })
      : apiClient.get('/feedback', { params: { page, limit } }),

  /**
   * Alias used by FeedbackTimeline
   */
  getFeedbackList: (page = 1, limit = 20, filters = {}) =>
    isMockMode()
      ? Promise.resolve((() => {
          let filtered = [...mockFeedback];
          if (filters.entityType) {
            filtered = filtered.filter((item) => item.entityType === filters.entityType);
          }
          if (filters.sentiment) {
            filtered = filtered.filter((item) => item.sentiment === filters.sentiment);
          }
          if (filters.driverId) {
            filtered = filtered.filter((item) => item.entityId === filters.driverId);
          }
          if (filters.dateFrom) {
            const from = new Date(filters.dateFrom);
            filtered = filtered.filter((item) => new Date(item.timestamp) >= from);
          }
          if (filters.dateTo) {
            const to = new Date(filters.dateTo);
            filtered = filtered.filter((item) => new Date(item.timestamp) <= to);
          }

          const start = (page - 1) * limit;
          const pageItems = filtered.slice(start, start + limit);
          return {
            data: pageItems,
            pagination: {
              page,
              limit,
              total: filtered.length,
              hasMore: start + limit < filtered.length,
            },
          };
        })())
      : apiClient.get('/feedback', { params: { page, limit, ...filters } }),

  /**
   * Get single feedback by ID
   * @param {string} id - Feedback ID
   * @returns {Promise}
   */
  getFeedbackById: (id) =>
    isMockMode()
      ? Promise.resolve(mockFeedback.find((item) => item.id === id))
      : apiClient.get(`/feedback/${id}`),

  /**
   * Get driver's feedback
   * @param {string} driverId - Driver ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise}
   */
  getDriverFeedback: (driverId, page = 1, limit = 20) =>
    isMockMode()
      ? Promise.resolve((() => {
          const filtered = mockFeedback.filter((item) => item.entityId === driverId);
          const start = (page - 1) * limit;
          return {
            data: filtered.slice(start, start + limit),
            pagination: {
              page,
              limit,
              total: filtered.length,
              hasMore: start + limit < filtered.length,
            },
          };
        })())
      : apiClient.get(`/feedback/driver/${driverId}`, { params: { page, limit } }),

  /**
   * Get feedback statistics
   * @returns {Promise}
   */
  getFeedbackStats: () =>
    isMockMode()
      ? Promise.resolve({ total: mockFeedback.length })
      : apiClient.get('/feedback/stats'),

  /**
   * Delete feedback
   * @param {string} id - Feedback ID
   * @returns {Promise}
   */
  deleteFeedback: (id) =>
    isMockMode()
      ? Promise.resolve({ success: true })
      : apiClient.delete(`/feedback/${id}`),
};
