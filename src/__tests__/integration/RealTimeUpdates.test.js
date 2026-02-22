/**
 * Real-Time Updates Tests
 * Test suite for polling and real-time updates functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AlertPoller, FeedbackPoller, DashboardPoller, RealTimeManager } from '../../../services/realTimeUpdates.js';

describe('Real-Time Updates Service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('AlertPoller', () => {
    it('should initialize with correct interval', () => {
      const mockStore = { alerts: [], addAlert: vi.fn() };
      const poller = new AlertPoller(mockStore, 30000);

      expect(poller.intervalMs).toBe(30000);
      expect(poller.store).toBe(mockStore);
    });

    it('should start and stop polling', () => {
      const mockStore = { alerts: [], addAlert: vi.fn() };
      const poller = new AlertPoller(mockStore, 5000);

      poller.start();
      expect(poller.pollerId).toBeDefined();

      poller.stop();
      expect(poller.pollerId).toBeNull();
    });

    it('should not start if already running', () => {
      const mockStore = { alerts: [], addAlert: vi.fn() };
      const poller = new AlertPoller(mockStore, 5000);

      poller.start();
      const firstId = poller.pollerId;
      poller.start();

      expect(poller.pollerId).toBe(firstId);
    });
  });

  describe('FeedbackPoller', () => {
    it('should initialize with correct interval', () => {
      const mockStore = { addSubmissions: vi.fn() };
      const poller = new FeedbackPoller(mockStore, 60000);

      expect(poller.intervalMs).toBe(60000);
      expect(poller.store).toBe(mockStore);
    });

    it('should manage lifecycle correctly', () => {
      const mockStore = { addSubmissions: vi.fn() };
      const poller = new FeedbackPoller(mockStore, 5000);

      poller.start();
      expect(poller.pollerId).toBeDefined();

      poller.stop();
      expect(poller.pollerId).toBeNull();

      poller.destroy();
      expect(poller.pollerId).toBeNull();
    });
  });

  describe('DashboardPoller', () => {
    it('should execute callback on poll', () => {
      const callback = vi.fn();
      const poller = new DashboardPoller(callback, 10000);

      poller.start();
      vi.advanceTimersToNextTimer();

      expect(callback).toHaveBeenCalled();
    });

    it('should respect poll interval', () => {
      const callback = vi.fn();
      const poller = new DashboardPoller(callback, 10000);

      poller.start();
      vi.advanceTimersByTime(5000);
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(5000);
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('RealTimeManager', () => {
    it('should initialize all pollers', () => {
      const stores = {
        alert: { alerts: [], addAlert: vi.fn() },
        feedback: { addSubmissions: vi.fn() },
        dashboard: {},
      };

      const manager = new RealTimeManager(stores);

      expect(manager.stores).toBe(stores);
      expect(manager.pollers).toHaveProperty('alerts');
      expect(manager.pollers).toHaveProperty('feedback');
      expect(manager.pollers).toHaveProperty('dashboard');
    });

    it('should start all pollers', () => {
      const stores = {
        alert: { alerts: [], addAlert: vi.fn() },
        feedback: { addSubmissions: vi.fn() },
        dashboard: {},
      };

      const manager = new RealTimeManager(stores);
      manager.startAll();

      expect(manager.pollers.alerts?.pollerId).toBeDefined();
      expect(manager.pollers.feedback?.pollerId).toBeDefined();
      expect(manager.pollers.dashboard?.pollerId).toBeDefined();
    });

    it('should stop all pollers', () => {
      const stores = {
        alert: { alerts: [], addAlert: vi.fn() },
        feedback: { addSubmissions: vi.fn() },
        dashboard: {},
      };

      const manager = new RealTimeManager(stores);
      manager.startAll();
      manager.stopAll();

      expect(manager.pollers.alerts?.pollerId).toBeNull();
      expect(manager.pollers.feedback?.pollerId).toBeNull();
      expect(manager.pollers.dashboard?.pollerId).toBeNull();
    });

    it('should start specific poller', () => {
      const stores = {
        alert: { alerts: [], addAlert: vi.fn() },
        feedback: { addSubmissions: vi.fn() },
      };

      const manager = new RealTimeManager(stores);
      manager.start('alerts');

      expect(manager.pollers.alerts?.pollerId).toBeDefined();
      expect(manager.pollers.feedback?.pollerId).toBeNull();
    });
  });
});
