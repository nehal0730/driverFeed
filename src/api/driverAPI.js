/**
 * Driver API
 * Endpoints for driver data and metrics
 */

import apiClient, { isMockMode } from './client.js';

const mockDrivers = [
  {
    id: 'd1',
    name: 'Asha Patel',
    email: 'asha.patel@example.com',
    phone: '+1 555-101-0001',
    totalTrips: 210,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/80?img=1',
    joinDate: '2023-02-01',
    status: 'active',
    metrics: {
      totalFeedback: 64,
      averageRating: 4.9,
      sentiment: { positive: 52, neutral: 10, negative: 2 },
      trend: 4.2,
      status: 'active',
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: 'd2',
    name: 'Miguel Santos',
    email: 'miguel.santos@example.com',
    phone: '+1 555-101-0002',
    totalTrips: 185,
    rating: 4.6,
    avatar: 'https://i.pravatar.cc/80?img=2',
    joinDate: '2022-09-14',
    status: 'active',
    metrics: {
      totalFeedback: 48,
      averageRating: 4.6,
      sentiment: { positive: 36, neutral: 9, negative: 3 },
      trend: 1.8,
      status: 'active',
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: 'd3',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@example.com',
    phone: '+1 555-101-0003',
    totalTrips: 86,
    rating: 2.1,
    avatar: 'https://i.pravatar.cc/80?img=3',
    joinDate: '2021-11-30',
    status: 'flagged',
    metrics: {
      totalFeedback: 22,
      averageRating: 2.1,
      sentiment: { positive: 4, neutral: 6, negative: 12 },
      trend: -3.4,
      status: 'flagged',
      lastUpdated: new Date().toISOString(),
    },
  },
];

const mockDriverDetail = (driver) => ({
  ...driver,
  sentimentTrend: Array.from({ length: 7 }).map((_, idx) => ({
    date: new Date(Date.now() - (6 - idx) * 86400000).toISOString().slice(0, 10),
    score: Math.max(1, Math.min(5, driver.rating + (idx - 3) * 0.15)),
    positive: Math.max(0, 10 - idx),
    neutral: 5 + idx,
    negative: Math.max(0, idx - 2),
  })),
  tagBreakdown: [
    { tag: 'professional', count: 14, sentiment: 'positive' },
    { tag: 'late', count: 6, sentiment: 'negative' },
  ],
  recentFeedback: [
    {
      id: 'f1',
      entityType: 'driver',
      entityId: driver.id,
      rating: Math.round(driver.rating),
      tags: ['professional'],
      sentiment: 'positive',
      timestamp: new Date().toISOString(),
      employeeId: 'e1',
    },
  ],
  isAlerted: driver.status === 'flagged',
  alertReason: driver.status === 'flagged' ? 'Below threshold' : undefined,
});

export const driverAPI = {
  /**
   * Get drivers list (paginated)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise}
   */
  getDrivers: (page = 1, limit = 20, filters = {}) => {
    if (isMockMode()) {
      const start = (page - 1) * limit;
      let filtered = mockDrivers.filter((driver) => {
        if (filters.search && !driver.name.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        if (filters.status && filters.status !== 'all' && driver.status !== filters.status) {
          return false;
        }
        return true;
      });

      if (Array.isArray(filters.scoreRange)) {
        const [minScore, maxScore] = filters.scoreRange;
        filtered = filtered.filter((driver) => driver.rating >= minScore && driver.rating <= maxScore);
      }

      if (filters.sortBy) {
        const direction = filters.sortOrder === 'asc' ? 1 : -1;
        filtered = [...filtered].sort((a, b) => {
          if (filters.sortBy === 'trips') {
            return (a.totalTrips - b.totalTrips) * direction;
          }
          if (filters.sortBy === 'trend') {
            return (a.metrics.trend - b.metrics.trend) * direction;
          }
          if (filters.sortBy === 'name') {
            return a.name.localeCompare(b.name) * direction;
          }
          return (a.rating - b.rating) * direction;
        });
      }

      return Promise.resolve({
        data: filtered.slice(start, start + limit),
        pagination: {
          page,
          limit,
          total: filtered.length,
          hasMore: start + limit < filtered.length,
        },
      });
    }

    return apiClient.get('/drivers', { params: { page, limit, ...filters } });
  },

  /**
   * Get single driver by ID
   * @param {string} id - Driver ID
   * @returns {Promise}
   */
  getDriver: (id) =>
    isMockMode()
      ? Promise.resolve(mockDriverDetail(mockDrivers.find((item) => item.id === id) || mockDrivers[0]))
      : apiClient.get(`/drivers/${id}`),

  /**
   * Get driver sentiment trend
   * @param {string} id - Driver ID
   * @param {number} days - Number of days to retrieve
   * @returns {Promise}
   */
  getDriverTrend: (id, days = 30) =>
    isMockMode()
      ? Promise.resolve(mockDriverDetail(mockDrivers.find((item) => item.id === id) || mockDrivers[0]).sentimentTrend)
      : apiClient.get(`/drivers/${id}/trend`, { params: { days } }),

  /**
   * Get driver metrics
   * @param {string} id - Driver ID
   * @returns {Promise}
   */
  getDriverMetrics: (id) =>
    apiClient.get(`/drivers/${id}/metrics`),

  /**
   * Get all drivers metrics
   * @returns {Promise}
   */
  getAllDriverMetrics: () =>
    apiClient.get('/drivers/metrics/all'),

  /**
   * Get drivers below threshold
   * @param {number} threshold - Rating threshold
   * @returns {Promise}
   */
  getDriversBelowThreshold: (threshold = 3.0) =>
    apiClient.get('/drivers/threshold', { params: { threshold } }),
};
