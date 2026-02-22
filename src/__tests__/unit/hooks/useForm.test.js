/**
 * Unit test: useForm hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../../../hooks/custom/useForm.js';

describe('useForm Hook', () => {
  it('should initialize with empty form data', () => {
    const { result } = renderHook(() => useForm());

    expect(result.current.formData).toEqual({});
  });

  it('should initialize with provided data', () => {
    const initialData = {
      driverRating: 5,
      driverComment: 'Great driver',
    };

    const { result } = renderHook(() => useForm(initialData));

    expect(result.current.formData).toEqual(initialData);
  });

  it('should update rating', () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.updateRating('driver', 4);
    });

    expect(result.current.formData.driverRating).toBe(4);
  });

  it('should toggle tags', () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.toggleTag('driver', 'polite');
    });

    expect(result.current.formData.driverTags).toContain('polite');

    act(() => {
      result.current.toggleTag('driver', 'polite');
    });

    expect(result.current.formData.driverTags).not.toContain('polite');
  });

  it('should validate form', () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.updateRating('driver', 3);
    });

    expect(result.current.isValid()).toBe(true);
  });

  it('should reset form to initial state', () => {
    const initialData = { driverRating: 5 };
    const { result } = renderHook(() => useForm(initialData));

    act(() => {
      result.current.updateField('driverComment', 'test');
    });

    expect(result.current.formData.driverComment).toBe('test');

    act(() => {
      result.current.reset();
    });

    expect(result.current.formData).toEqual(initialData);
  });
});
