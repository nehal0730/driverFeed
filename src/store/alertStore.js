/**
 * Alert Store using Zustand
 * Manages alerts and toast notifications
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * @typedef {Object} AlertState
 * @property {Array} alerts
 * @property {Array} toasts
 * @property {number} unreadCount
 * @property {Function} addAlert
 * @property {Function} removeAlert
 * @property {Function} markAsRead
 * @property {Function} addToast
 * @property {Function} removeToast
 * @property {Function} clearAllAlerts
 */

export const useAlertStore = create(
  devtools((set, get) => ({
    alerts: [],
    toasts: [],
    unreadCount: 0,

    /**
     * Add a new alert
     * @param {Object} alert
     */
    addAlert: (alert) =>
      set((state) => ({
        alerts: [alert, ...state.alerts],
        unreadCount: state.unreadCount + 1,
      })),

    /**
     * Remove an alert by ID
     * @param {string} id
     */
    removeAlert: (id) =>
      set((state) => {
        const alert = state.alerts.find((a) => a.id === id);
        return {
          alerts: state.alerts.filter((a) => a.id !== id),
          unreadCount: alert && !alert.read ? state.unreadCount - 1 : state.unreadCount,
        };
      }),

    /**
     * Mark alert as read
     * @param {string} id
     */
    markAsRead: (id) =>
      set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === id ? { ...a, read: true } : a
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),

    /**
     * Add a toast notification
     * @param {Object} toast
     */
    addToast: (toast) =>
      set((state) => ({
        toasts: [
          ...state.toasts,
          {
            id: toast.id || `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            ...toast,
          },
        ],
      })),

    /**
     * Remove a toast by ID
     * @param {string} id
     */
    removeToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),

    /**
     * Clear all alerts
     */
    clearAllAlerts: () =>
      set({
        alerts: [],
        unreadCount: 0,
      }),
  }))
);
