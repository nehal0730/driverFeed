/**
 * Custom Hooks for data fetching and mutations
 */

import { useState, useEffect, useCallback } from 'react';

const cacheStore = new Map();

/**
 * Generic fetch hook for async data loading
 * @template T
 * @param {Function} fetchFn - Async function to fetch data
 * @param {Array} dependencies - Dependency array
 * @returns {Object} - { data, loading, error, isSuccess, refetch }
 */
export const useFetch = (fetchFn, dependencies = [], options = {}) => {
  const { cacheKey, enabled = true } = options;
  const [state, setState] = useState({
    data: null,
    loading: enabled,
    error: null,
    isSuccess: false,
  });

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;
    if (!force && cacheKey && cacheStore.has(cacheKey)) {
      setState((prev) => ({
        ...prev,
        data: cacheStore.get(cacheKey),
        loading: false,
        error: null,
        isSuccess: true,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await fetchFn();
      if (cacheKey) {
        cacheStore.set(cacheKey, result);
      }
      setState((prev) => ({
        ...prev,
        data: result,
        loading: false,
        isSuccess: true,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err,
        loading: false,
        isSuccess: false,
      }));
    }
  }, [fetchFn, cacheKey, enabled]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    ...state,
    refetch: fetchData,
  };
};

/**
 * Mutation hook for async operations (POST, PUT, PATCH, DELETE)
 * @template T, P
 * @param {Function} mutationFn - Async function for mutation
 * @param {Object} options - { onSuccess, onError }
 * @returns {Object} - { mutate, loading, error, data, reset }
 */
export const useMutation = (mutationFn, options = {}) => {
  const { onSuccess, onError } = options;
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  });

  const mutate = useCallback(async (...args) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await mutationFn(...args);
      setState((prev) => ({
        ...prev,
        data: result,
        loading: false,
      }));
      onSuccess?.(result);
      return result;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err,
        loading: false,
      }));
      onError?.(err);
      throw err;
    }
  }, [mutationFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      data: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
};

/**
 * Debounced fetch hook for search/filter
 * @template T
 * @param {Function} fetchFn - Async function to fetch data
 * @param {number} delay - Debounce delay in ms
 * @returns {Object} - { data, loading, error, search }
 */
export const useDebouncedFetch = (fetchFn, delay = 500) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setState({ data: null, loading: false, error: null });
        return;
      }

      setState((prev) => ({ ...prev, loading: true }));
      try {
        const result = await fetchFn(searchTerm);
        setState((prev) => ({
          ...prev,
          data: result,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err,
          loading: false,
        }));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchFn, delay]);

  return {
    ...state,
    search: searchTerm,
    setSearch: setSearchTerm,
  };
};
