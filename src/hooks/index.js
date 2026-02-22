import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService.js';

export const useFetch = (fetchFn, dependencies = []) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const result = await fetchFn();
        if (isMounted) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err : new Error('Unknown error'),
          });
        }
      }
    };

    fetch();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
};

export const useDashboardStats = () => {
  return useFetch(() => dataService.getDashboardStats(), []);
};

export const useDrivers = (limit) => {
  return useFetch(() => dataService.getDrivers(limit), [limit]);
};

export const useFeedback = (limit) => {
  return useFetch(() => dataService.getFeedback(limit), [limit]);
};

export const useSentimentTrend = () => {
  return useFetch(() => dataService.getSentimentTrend(), []);
};

export const useDriverPerformance = () => {
  return useFetch(() => dataService.getDriverPerformance(), []);
};

export const useCategoryMetrics = () => {
  return useFetch(() => dataService.getCategoryMetrics(), []);
};

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
