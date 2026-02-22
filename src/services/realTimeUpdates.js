/**
 * Real-Time Updates Service
 * Implements polling and WebSocket-ready architecture for live updates
 */

import { alertAPI } from '../api/alertAPI.js';
import { feedbackAPI } from '../api/feedbackAPI.js';
import { dashboardAPI } from '../api/dashboardAPI.js';

/**
 * Real-time alerts poller
 * Polls for new alerts at specified intervals
 */
export class AlertPoller {
  constructor(store, intervalMs = 30000) {
    this.store = store;
    this.intervalMs = intervalMs;
    this.pollerId = null;
  }

  /**
   * Start polling for alerts
   */
  start() {
    if (this.pollerId) return; // Already running

    // Poll immediately
    this.poll();

    // Set up interval
    this.pollerId = setInterval(() => this.poll(), this.intervalMs);
  }

  /**
   * Stop polling
   */
  stop() {
    if (this.pollerId) {
      clearInterval(this.pollerId);
      this.pollerId = null;
    }
  }

  /**
   * Perform a single poll
   */
  async poll() {
    try {
      const response = await alertAPI.getAlerts(1, 50);
      if (response.data && response.data.length > 0) {
        const state = this.store.getState ? this.store.getState() : this.store;
        // Add new alerts to store
        response.data.forEach((alert) => {
          if (!state.alerts.find((a) => a.id === alert.id)) {
            state.addAlert(alert);
          }
        });
      }
    } catch (error) {
      console.error('Error polling for alerts:', error);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stop();
  }
}

/**
 * Real-time feedback poller
 * Polls for new feedback submissions
 */
export class FeedbackPoller {
  constructor(store, intervalMs = 60000) {
    this.store = store;
    this.intervalMs = intervalMs;
    this.pollerId = null;
  }

  /**
   * Start polling for feedback
   */
  start() {
    if (this.pollerId) return;
    this.poll();
    this.pollerId = setInterval(() => this.poll(), this.intervalMs);
  }

  /**
   * Stop polling
   */
  stop() {
    if (this.pollerId) {
      clearInterval(this.pollerId);
      this.pollerId = null;
    }
  }

  /**
   * Perform a single poll
   */
  async poll() {
    try {
      const response = await feedbackAPI.getFeedback(1, 100);
      if (response.data && response.data.length > 0) {
        const state = this.store.getState ? this.store.getState() : this.store;
        state.addSubmissions(response.data);
      }
    } catch (error) {
      console.error('Error polling for feedback:', error);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stop();
  }
}

/**
 * Real-time dashboard poller
 * Polls for dashboard stats updates
 */
export class DashboardPoller {
  constructor(statsCallback, intervalMs = 120000) {
    this.statsCallback = statsCallback;
    this.intervalMs = intervalMs;
    this.pollerId = null;
  }

  /**
   * Start polling
   */
  start() {
    if (this.pollerId) return;
    this.poll();
    this.pollerId = setInterval(() => this.poll(), this.intervalMs);
  }

  /**
   * Stop polling
   */
  stop() {
    if (this.pollerId) {
      clearInterval(this.pollerId);
      this.pollerId = null;
    }
  }

  /**
   * Perform a single poll
   */
  async poll() {
    try {
      const stats = await dashboardAPI.getStats('7days');
      this.statsCallback(stats);
    } catch (error) {
      console.error('Error polling dashboard stats:', error);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stop();
  }
}

/**
 * Unified real-time updates manager
 * Coordinates all polling services
 */
export class RealTimeManager {
  constructor(stores, options = {}) {
    this.stores = stores;
    this.alertInterval = options.alertInterval || (import.meta.env.VITE_ALERTS_CHECK_INTERVAL || 30000);
    this.feedbackInterval = options.feedbackInterval || 60000;
    this.dashboardInterval = options.dashboardInterval || 120000;
    
    this.pollers = {
      alerts: null,
      feedback: null,
      dashboard: null,
    };
  }

  /**
   * Start all real-time updates
   */
  startAll() {
    // Start alerts poller
    if (this.stores.alert) {
      this.pollers.alerts = new AlertPoller(this.stores.alert, this.alertInterval);
      this.pollers.alerts.start();
    }

    // Start feedback poller
    if (this.stores.feedback) {
      this.pollers.feedback = new FeedbackPoller(this.stores.feedback, this.feedbackInterval);
      this.pollers.feedback.start();
    }

    // Start dashboard poller  
    if (this.stores.dashboard) {
      this.pollers.dashboard = new DashboardPoller(
        (stats) => {
          // Handle dashboard stats update
          console.log('Dashboard stats updated:', stats);
        },
        this.dashboardInterval
      );
      this.pollers.dashboard.start();
    }
  }

  /**
   * Stop all real-time updates
   */
  stopAll() {
    Object.values(this.pollers).forEach((poller) => {
      if (poller) poller.stop();
    });
  }

  /**
   * Start specific poller
   */
  start(type) {
    if (this.pollers[type]) {
      this.pollers[type].start();
    }
  }

  /**
   * Stop specific poller
   */
  stop(type) {
    if (this.pollers[type]) {
      this.pollers[type].stop();
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopAll();
    Object.keys(this.pollers).forEach((key) => {
      if (this.pollers[key]) {
        this.pollers[key].destroy();
        this.pollers[key] = null;
      }
    });
  }
}
