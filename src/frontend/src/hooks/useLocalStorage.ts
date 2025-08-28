import { useState, useEffect, useCallback } from 'react';

export interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const {
    defaultValue,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
  } = options;

  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue !== undefined ? defaultValue : initialValue;
      }
      return deserializer(item);
    } catch (error) {
      // localStorage read error
      return defaultValue !== undefined ? defaultValue : initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serializer(valueToStore));
      }
    } catch (error) {
      // localStorage set error
    }
  }, [key, serializer, storedValue]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      // localStorage remove error
    }
  }, [key, initialValue]);

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserializer(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserializer]);

  return [storedValue, setValue, removeValue];
}

// Specialized hooks for common types
export function useLocalStorageString(key: string, initialValue: string = '') {
  return useLocalStorage(key, initialValue, {
    serializer: (value) => value,
    deserializer: (value) => value,
  });
}

export function useLocalStorageNumber(key: string, initialValue: number = 0) {
  return useLocalStorage(key, initialValue, {
    serializer: (value) => value.toString(),
    deserializer: (value) => Number(value),
  });
}

export function useLocalStorageBoolean(key: string, initialValue: boolean = false) {
  return useLocalStorage(key, initialValue, {
    serializer: (value) => value.toString(),
    deserializer: (value) => value === 'true',
  });
}

export function useLocalStorageArray<T>(key: string, initialValue: T[] = []) {
  return useLocalStorage<T[]>(key, initialValue);
}

export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  initialValue: T
) {
  return useLocalStorage<T>(key, initialValue);
}

// Hook for managing multiple localStorage values
export function useLocalStorageMulti<T extends Record<string, any>>(
  keys: Record<keyof T, string>,
  initialValues: T
) {
  const result = {} as Record<keyof T, [T[keyof T], (value: T[keyof T]) => void, () => void]>;

  for (const key in keys) {
    const storageKey = keys[key];
    const initialValue = initialValues[key];
    result[key] = useLocalStorage(storageKey, initialValue);
  }

  return result;
}

// Hook for managing localStorage with expiration
export function useLocalStorageWithExpiry<T>(
  key: string,
  initialValue: T,
  expiryInMinutes: number = 60
): [T | null, (value: T) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage<{
    value: T;
    expiry: number;
  } | null>(key, null);

  const getValue = (): T | null => {
    if (!value) return null;
    
    const now = new Date().getTime();
    if (now > value.expiry) {
      removeValue();
      return null;
    }
    
    return value.value;
  };

  const setValueWithExpiry = (newValue: T) => {
    const expiry = new Date().getTime() + expiryInMinutes * 60 * 1000;
    setValue({ value: newValue, expiry });
  };

  return [getValue(), setValueWithExpiry, removeValue];
}

// Hook for managing localStorage with versioning
export function useLocalStorageWithVersion<T>(
  key: string,
  initialValue: T,
  version: string = '1.0.0'
): [T, (value: T) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage<{
    value: T;
    version: string;
  }>(key, { value: initialValue, version });

  // Check if version matches, if not, reset to initial value
  if (value.version !== version) {
    setValue({ value: initialValue, version });
  }

  const getValue = (): T => value.value;
  const setValueWithVersion = (newValue: T) => {
    setValue({ value: newValue, version });
  };

  return [getValue(), setValueWithVersion, removeValue];
}

export default useLocalStorage; 