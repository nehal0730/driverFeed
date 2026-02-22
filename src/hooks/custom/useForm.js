/**
 * Custom Hook for form state management
 */

import { useState, useCallback } from 'react';

const INITIAL_FORM_STATE = {
  driverRating: 0,
  driverTags: [],
  driverComment: '',
  tripRating: 0,
  tripTags: [],
  tripComment: '',
  appRating: 0,
  appTags: [],
  appComment: '',
  marshalRating: 0,
  marshalTags: [],
  marshalComment: '',
};

/**
 * Form state management hook
 * @returns {Object} - Form state and handlers
 */
export const useForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateRating = useCallback((entityType, rating) => {
    setFormData((prev) => ({
      ...prev,
      [`${entityType}Rating`]: rating,
    }));
  }, []);

  const toggleTag = useCallback((entityType, tag) => {
    setFormData((prev) => {
      const tagsKey = `${entityType}Tags`;
      const currentTags = prev[tagsKey] || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      return {
        ...prev,
        [tagsKey]: newTags,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, []);

  const isValid = useCallback(() => {
    // At least one rating is required
    const hasRating =
      formData.driverRating ||
      formData.tripRating ||
      formData.appRating ||
      formData.marshalRating;
    return hasRating;
  }, [formData]);

  const hasChanges = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_FORM_STATE);
  }, [formData]);

  return {
    formData,
    updateField,
    updateRating,
    toggleTag,
    reset,
    isValid,
    hasChanges,
  };
};

/**
 * Field-level form validation
 * @param {string} field - Field name
 * @param {any} value - Field value
 * @returns {string|null} - Error message or null
 */
export const useFormValidation = (field, value) => {
  if (!value || !field) return null;

  const validators = {
    email: (val) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Invalid email',
    minLength: (val, min = 3) =>
      val.length >= min ? null : `Minimum ${min} characters required`,
    maxLength: (val, max = 500) =>
      val.length <= max ? null : `Maximum ${max} characters allowed`,
    required: (val) =>
      val?.trim() ? null : 'This field is required',
  };

  return validators[field]?.(value) || null;
};
