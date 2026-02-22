/**
 * Accessibility and Performance Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import {
  debounce,
  throttle,
  getVisibleRange,
} from '../../../utils/performance.js';
import {
  createAriaId,
  getContrastLevel,
} from '../../../utils/accessibility.js';

describe('Performance Utilities', () => {
  describe('Debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0;
      const fn = () => callCount++;
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(callCount).toBe(0);

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(callCount).toBe(1);
    });
  });

  describe('Throttle', () => {
    it('should throttle function calls', async () => {
      let callCount = 0;
      const fn = () => callCount++;
      const throttledFn = throttle(fn, 100);

      throttledFn();
      expect(callCount).toBe(1);

      throttledFn();
      throttledFn();
      expect(callCount).toBe(1);

      await new Promise((resolve) => setTimeout(resolve, 150));
      throttledFn();
      expect(callCount).toBe(2);
    });
  });

  describe('Virtual scrolling', () => {
    it('should calculate visible range correctly', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({id: i}));
      const result = getVisibleRange(items, 0, 50, 300, 5);

      expect(result.startIndex).toBe(0);
      expect(result.visibleItems.length).toBeGreaterThan(0);
    });

    it('should handle overscan parameter', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({id: i}));
      const result = getVisibleRange(items, 1000, 50, 300, 10);

      expect(result.startIndex).toBeGreaterThan(0);
      expect(result.visibleItems.length).toBeGreaterThan(0);
    });
  });
});

describe('Accessibility Utilities', () => {
  describe('ARIA ID Generation', () => {
    it('should generate unique IDs', () => {
      const id1 = createAriaId('test');
      const id2 = createAriaId('test');

      expect(id1).toMatch(/^test-/);
      expect(id2).toMatch(/^test-/);
      expect(id1).not.toBe(id2);
    });

    it('should use custom prefix', () => {
      const id = createAriaId('custom');
      expect(id).toMatch(/^custom-/);
    });
  });

  describe('Contrast Level', () => {
    it('should identify AAA contrast', () => {
      // White on black has very high contrast
      const level = getContrastLevel('#FFFFFF', '#000000');
      expect(level).toBe('AAA');
    });

    it('should identify AA contrast', () => {
      // Medium gray on white
      const level = getContrastLevel('#777777', '#FFFFFF');
      expect(['AA', 'AAA']).toContain(level);
    });

    it('should identify failed contrast', () => {
      // Very similar colors
      const level = getContrastLevel('#CCCCCC', '#CCCCDD');
      expect(level).toBe('FAIL');
    });
  });
});
