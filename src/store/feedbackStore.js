/**
 * Feedback Store using Zustand
 * Manages feedback submissions and form state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * @typedef {Object} FeedbackState
 * @property {Array} submissions
 * @property {Object|null} currentSubmission
 * @property {boolean} loading
 * @property {string|null} error
 * @property {boolean} hasSubmitted
 * @property {Function} addSubmission
 * @property {Function} setCurrentSubmission
 * @property {Function} clearCurrentSubmission
 * @property {Function} setLoading
 * @property {Function} setError
 * @property {Function} setHasSubmitted
 * @property {Function} addSubmissions
 */

export const useFeedbackStore = create(
  devtools((set) => ({
    submissions: [],
    currentSubmission: null,
    loading: false,
    error: null,
    hasSubmitted: false,

    /**
     * Add a single feedback submission
     * @param {Object} submission - Feedback submission object
     */
    addSubmission: (submission) =>
      set((state) => ({
        submissions: [...state.submissions, submission],
        currentSubmission: submission,
        hasSubmitted: true,
      })),

    /**
     * Set current feedback submission
     * @param {Object} data - Form data
     */
    setCurrentSubmission: (data) =>
      set({
        currentSubmission: data,
      }),

    /**
     * Clear current submission
     */
    clearCurrentSubmission: () =>
      set({
        currentSubmission: null,
        error: null,
      }),

    /**
     * Set loading state
     * @param {boolean} loading
     */
    setLoading: (loading) => set(() => ({ loading })),

    /**
     * Set error state
     * @param {string|null} error
     */
    setError: (error) => set(() => ({ error })),

    /**
     * Set has submitted flag
     * @param {boolean} hasSubmitted
     */
    setHasSubmitted: (hasSubmitted) => set(() => ({ hasSubmitted })),

    /**
     * Add multiple submissions
     * @param {Array} submissions
     */
    addSubmissions: (submissions) =>
      set((state) => ({
        submissions: [...state.submissions, ...submissions],
      })),
  }))
);
