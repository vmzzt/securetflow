/**
 * Object Utilities
 * Utility functions for object manipulation and operations
 */

/**
 * Deep clones an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned as T;
  }

  return obj;
};

/**
 * Merges multiple objects deeply
 */
export const deepMerge = <T extends Record<string, any>>(...objects: Partial<T>[]): T => {
  const result = {} as T;

  objects.forEach(obj => {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach(key => {
      const value = (obj as any)[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        (result as any)[key] = deepMerge((result as any)[key] || {}, value);
      } else {
        (result as any)[key] = value;
      }
    });
  });

  return result;
};

/**
 * Picks specific keys from an object
 */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      (result as any)[key] = (obj as any)[key];
    }
  });
  return result;
};

/**
 * Omits specific keys from an object
 */
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

/**
 * Gets nested object properties using dot notation
 */
export const get = <T>(obj: any, path: string, defaultValue?: T): T | undefined => {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
};

/**
 * Sets nested object properties using dot notation
 */
export const set = <T extends Record<string, any>>(
  obj: T,
  path: string,
  value: any
): T => {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result;
};

/**
 * Checks if an object has nested properties
 */
export const has = (obj: any, path: string): boolean => {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return false;
    }
    current = current[key];
  }

  return true;
};

/**
 * Flattens a nested object into a single level
 */
export const flatten = (obj: any, prefix = ''): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flatten(value, newKey));
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
};

/**
 * Unflattens a flattened object back to nested structure
 */
export const unflatten = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      set(result, key, obj[key]);
    }
  }

  return result;
};

/**
 * Transforms object keys using a function
 */
export const transformKeys = <T extends Record<string, any>>(
  obj: T,
  transformer: (key: string) => string
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = transformer(key);
      result[newKey] = obj[key];
    }
  }

  return result;
};

/**
 * Transforms object values using a function
 */
export const transformValues = <T extends Record<string, any>, U>(
  obj: T,
  transformer: (value: any, key: string) => U
): Record<string, U> => {
  const result: Record<string, U> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = transformer(obj[key], key);
    }
  }

  return result;
};

/**
 * Filters object entries based on a predicate
 */
export const filter = <T extends Record<string, any>>(
  obj: T,
  predicate: (value: any, key: string) => boolean
): Partial<T> => {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }

  return result;
};

/**
 * Maps object entries to a new object
 */
export const map = <T extends Record<string, any>, U>(
  obj: T,
  mapper: (value: any, key: string) => U
): Record<string, U> => {
  const result: Record<string, U> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = mapper(obj[key], key);
    }
  }

  return result;
};

/**
 * Reduces object entries to a single value
 */
export const reduce = <T extends Record<string, any>, U>(
  obj: T,
  reducer: (acc: U, value: any, key: string) => U,
  initialValue: U
): U => {
  let result = initialValue;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = reducer(result, obj[key], key);
    }
  }

  return result;
};

/**
 * Checks if two objects are deeply equal
 */
export const isEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null) return obj1 === obj2;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every(key => keys2.includes(key) && isEqual(obj1[key], obj2[key]));
};

/**
 * Creates an object from an array of key-value pairs
 */
export const fromEntries = <T>(entries: [string, T][]): Record<string, T> => {
  const result: Record<string, T> = {};
  entries.forEach(([key, value]) => {
    result[key] = value;
  });
  return result;
};

/**
 * Converts an object to an array of key-value pairs
 */
export const toEntries = <T>(obj: Record<string, T>): [string, T][] => {
  return Object.keys(obj).map(key => [key, obj[key]]);
};

/**
 * Gets all keys from an object (including inherited ones)
 */
export const getAllKeys = (obj: any): string[] => {
  const keys: string[] = [];
  for (const key in obj) {
    keys.push(key);
  }
  return keys;
};

/**
 * Gets only own keys from an object
 */
export const getOwnKeys = (obj: any): string[] => {
  return Object.keys(obj);
};

/**
 * Gets all values from an object
 */
export const getValues = <T>(obj: Record<string, T>): T[] => {
  return Object.values(obj);
};

/**
 * Inverts object keys and values
 */
export const invert = <T extends Record<string, string | number>>(
  obj: T
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[String(obj[key])] = key;
    }
  }
  return result;
};

/**
 * Creates a new object with default values
 */
export const defaults = <T extends Record<string, any>>(
  obj: Partial<T>,
  defaults: T
): T => {
  return deepMerge(defaults, obj);
};

/**
 * Creates a new object with only the specified keys
 */
export const only = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  return pick(obj, keys);
};

/**
 * Creates a new object without the specified keys
 */
export const except = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  return omit(obj, keys);
};

/**
 * Checks if an object is empty
 */
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj !== 'object') return false;
  return Object.keys(obj).length === 0;
};

/**
 * Checks if an object has any properties
 */
export const isNotEmpty = (obj: any): boolean => {
  return !isEmpty(obj);
};

/**
 * Gets the size of an object (number of own properties)
 */
export const size = (obj: any): number => {
  if (obj === null || obj === undefined) return 0;
  return Object.keys(obj).length;
};

/**
 * Creates a frozen copy of an object
 */
export const freeze = <T>(obj: T): Readonly<T> => {
  return Object.freeze(deepClone(obj));
};

/**
 * Creates a sealed copy of an object
 */
export const seal = <T>(obj: T): T => {
  return Object.seal(deepClone(obj));
};

/**
 * Creates a preventExtensions copy of an object
 */
export const preventExtensions = <T>(obj: T): T => {
  return Object.preventExtensions(deepClone(obj));
};

/**
 * Creates a new object with sorted keys
 */
export const sortKeys = <T extends Record<string, any>>(
  obj: T,
  compareFn?: (a: string, b: string) => number
): T => {
  const sortedKeys = Object.keys(obj).sort(compareFn);
  const result = {} as T;
  
  sortedKeys.forEach(key => {
    result[key as keyof T] = obj[key as keyof T];
  });
  
  return result;
};

/**
 * Creates a new object with keys in reverse order
 */
export const reverseKeys = <T extends Record<string, any>>(obj: T): T => {
  const keys = Object.keys(obj).reverse();
  const result = {} as T;
  
  keys.forEach(key => {
    result[key as keyof T] = obj[key as keyof T];
  });
  
  return result;
}; 