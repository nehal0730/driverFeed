/**
 * Dashboard Store using Zustand
 * Manages dashboard UI state and filters
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * @typedef {Object} DashboardState
 * @property {Object} dateRange
 * @property {Object} driverFilters
 * @property {Object} feedbackFilters
 * @property {string|null} selectedDriverId
 * @property {Function} setDateRange
 * @property {Function} setDriverFilters
 * @property {Function} setFeedbackFilters
 * @property {Function} setSelectedDriver
 * @property {Function} reset
 */

export const useDashboardStore = create(
  devtools((set) => ({
    dateRange: {
      type: '7days',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    },
    driverFilters: {
      search: '',
      status: null,
      scoreRange: [0, 5],
      sortBy: 'rating',
      sortOrder: 'desc',
    },
    feedbackFilters: {
      entityType: null,
      sentiment: null,
      ratingRange: [0, 5],
      dateFrom: null,
      dateTo: null,
      driverId: null,
    },
    selectedDriverId: null,

    /**
     * Set date range
     * @param {string} type - 'today', '7days', or '30days'
     */
    setDateRange: (type) => {
      const endDate = new Date();
      let startDate = new Date();

      if (type === 'today') {
        startDate.setDate(endDate.getDate());
      } else if (type === '7days') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (type === '30days') {
        startDate.setDate(endDate.getDate() - 30);
      }

      set({
        dateRange: { type, startDate, endDate },
      });
    },

    /**
     * Set driver filters
     * @param {Object} filters
     */
    setDriverFilters: (filters) =>
      set((state) => ({
        driverFilters: { ...state.driverFilters, ...filters },
      })),

    /**
     * Set feedback filters
     * @param {Object} filters
     */
    setFeedbackFilters: (filters) =>
      set((state) => ({
        feedbackFilters: { ...state.feedbackFilters, ...filters },
      })),

    /**
     * Set selected driver ID
     * @param {string|null} driverId
     */
    setSelectedDriver: (driverId) =>
      set({
        selectedDriverId: driverId,
      }),

    /**
     * Reset all filters to defaults
     */
    reset: () =>
      set({
        dateRange: {
          type: '7days',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
        },
        driverFilters: {
          search: '',
          status: null,
          scoreRange: [0, 5],
          sortBy: 'rating',
          sortOrder: 'desc',
        },
        feedbackFilters: {
          entityType: null,
          sentiment: null,
          ratingRange: [0, 5],
          dateFrom: null,
          dateTo: null,
          driverId: null,
        },
        selectedDriverId: null,
      }),
  }))
);
