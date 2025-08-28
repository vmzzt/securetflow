import { useState, useEffect, useCallback } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        callback(...args);
      }, delay);

      setDebounceTimer(timer);
    },
    [callback, delay, debounceTimer]
  ) as T;

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}

export function useDebounceState<T>(
  initialValue: T,
  delay: number
): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);

  return [value, debouncedValue, setValue];
}

export function useDebounceEffect<T>(
  value: T,
  effect: (value: T) => void,
  delay: number
): void {
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    effect(debouncedValue);
  }, [debouncedValue, effect]);
}

export function useDebounceSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay: number = 300
): {
  results: T[];
  loading: boolean;
  search: (query: string) => void;
  clear: () => void;
} {
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, delay);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchFunction(debouncedQuery)
      .then((data) => {
        setResults(data);
      })
      .catch((error) => {
        console.error('Search error:', error);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedQuery, searchFunction]);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clear = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    setLoading(false);
  }, []);

  return { results, loading, search, clear };
}

export function useDebounceForm<T>(
  initialValues: T,
  onSubmit: (values: T) => void,
  delay: number = 500
): {
  values: T;
  debouncedValues: T;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  reset: () => void;
  submit: () => void;
} {
  const [values, setValues] = useState<T>(initialValues);
  const debouncedValues = useDebounce(values, delay);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setValuesPartial = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const submit = useCallback(() => {
    onSubmit(debouncedValues);
  }, [debouncedValues, onSubmit]);

  return {
    values,
    debouncedValues,
    setValue,
    setValues: setValuesPartial,
    reset,
    submit,
  };
}

export function useDebounceScroll(
  callback: (scrollTop: number) => void,
  delay: number = 100
): void {
  const [scrollTop, setScrollTop] = useState(0);
  const debouncedScrollTop = useDebounce(scrollTop, delay);

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.pageYOffset || document.documentElement.scrollTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    callback(debouncedScrollTop);
  }, [debouncedScrollTop, callback]);
}

export function useDebounceResize(
  callback: (dimensions: { width: number; height: number }) => void,
  delay: number = 250
): void {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const debouncedDimensions = useDebounce(dimensions, delay);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Set initial dimensions
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    callback(debouncedDimensions);
  }, [debouncedDimensions, callback]);
}

export function useDebounceInput<T>(
  initialValue: T,
  onChange: (value: T) => void,
  delay: number = 300
): {
  value: T;
  setValue: (value: T) => void;
  debouncedValue: T;
} {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return { value, setValue, debouncedValue };
}

export function useDebounceAsync<T, R>(
  asyncFunction: (value: T) => Promise<R>,
  delay: number = 300
): {
  result: R | null;
  loading: boolean;
  error: Error | null;
  execute: (value: T) => void;
  reset: () => void;
} {
  const [result, setResult] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastValue, setLastValue] = useState<T | null>(null);
  const debouncedValue = useDebounce(lastValue, delay);

  useEffect(() => {
    if (debouncedValue === null) return;

    setLoading(true);
    setError(null);

    asyncFunction(debouncedValue)
      .then((data) => {
        setResult(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedValue, asyncFunction]);

  const execute = useCallback((value: T) => {
    setLastValue(value);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setLoading(false);
    setError(null);
    setLastValue(null);
  }, []);

  return { result, loading, error, execute, reset };
}

export default useDebounce; 