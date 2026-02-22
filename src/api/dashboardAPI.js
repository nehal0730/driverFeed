/**
 * Dashboard API
 * Endpoints for dashboard analytics
 */

import apiClient, { isMockMode } from './client.js';

const mockStats = {
  totalFeedback: 128,
  averageRating: 4.2,
  sentimentScore: 78,
  activeDrivers: 42,
  weeklyTrend: 6.5,
  monthlyGrowth: 12.3,
  alertCount: 3,
  driversBelow: 2,
  sentiment: {
    positive: 78,
    neutral: 32,
    negative: 18,
  },
};

const mockSentimentDistribution = {
  positive: 78,
  neutral: 32,
  negative: 18,
  total: 128,
};

const mockCategoryBreakdown = [
  { category: 'driver', count: 52 },
  { category: 'trip', count: 38 },
  { category: 'app', count: 22 },
  { category: 'marshal', count: 16 },
];

const mockTopDrivers = [
  { id: 'd1', name: 'Asha Patel', rating: 4.9, totalTrips: 210 },
  { id: 'd2', name: 'Miguel Santos', rating: 4.8, totalTrips: 185 },
  { id: 'd3', name: 'Priya Nair', rating: 4.7, totalTrips: 198 },
];

const mockBottomDrivers = [
  { id: 'd9', name: 'Ravi Kumar', rating: 2.1, totalTrips: 86 },
  { id: 'd10', name: 'Liu Wei', rating: 2.3, totalTrips: 102 },
];

const mockRecentFeedback = [
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
];

export const dashboardAPI = {
  /**
   * Get dashboard statistics
   * @param {string} dateRange - Date range type
   * @returns {Promise}
   */
  getStats: (params) =>
    isMockMode()
      ? Promise.resolve(mockStats)
      : apiClient.get('/dashboard/stats', { params }),

  /**
   * Get sentiment distribution
   * @param {string} dateRange - Date range type
   * @returns {Promise}
   */
  getSentimentDistribution: (params) =>
    isMockMode()
      ? Promise.resolve(mockSentimentDistribution)
      : apiClient.get('/dashboard/sentiment-distribution', { params }),

  /**
   * Get category breakdown
   * @param {string} dateRange - Date range type
   * @returns {Promise}
   */
  getCategoryBreakdown: (params) =>
    isMockMode()
      ? Promise.resolve(mockCategoryBreakdown)
      : apiClient.get('/dashboard/category-breakdown', { params }),

  /**
   * Get top drivers
   * @param {number} limit - Number of drivers
   * @returns {Promise}
   */
  getTopDrivers: (limit = 10) =>
    isMockMode()
      ? Promise.resolve(mockTopDrivers.slice(0, limit))
      : apiClient.get('/dashboard/top-drivers', { params: { limit } }),

  /**
   * Get bottom drivers
   * @param {number} limit - Number of drivers
   * @returns {Promise}
   */
  getBottomDrivers: (limit = 10) =>
    isMockMode()
      ? Promise.resolve(mockBottomDrivers.slice(0, limit))
      : apiClient.get('/dashboard/bottom-drivers', { params: { limit } }),

  /**
   * Get recent feedback
   * @param {number} limit - Number of items
   * @returns {Promise}
   */
  getRecentFeedback: (limit = 20) =>
    isMockMode()
      ? Promise.resolve(mockRecentFeedback.slice(0, limit))
      : apiClient.get('/dashboard/recent-feedback', { params: { limit } }),
};
