/**
 * Array Utilities
 * Utility functions for array manipulation and operations
 */

/**
 * Chunks an array into smaller arrays of specified size
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Removes duplicate items from an array
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Removes duplicate objects from an array based on a key
 */
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Groups array items by a specified key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Sorts an array by multiple criteria
 */
export const sortBy = <T>(
  array: T[],
  ...criteria: Array<{ key: keyof T; direction?: 'asc' | 'desc' }>
): T[] => {
  return [...array].sort((a, b) => {
    for (const { key, direction = 'asc' } of criteria) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Filters array items based on multiple conditions
 */
export const filterBy = <T>(
  array: T[],
  filters: Partial<Record<keyof T, any>>
): T[] => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      return item[key as keyof T] === value;
    });
  });
};

/**
 * Finds the first item that matches the predicate
 */
export const findFirst = <T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): T | undefined => {
  return array.find(predicate);
};

/**
 * Finds all items that match the predicate
 */
export const findAll = <T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): T[] => {
  return array.filter(predicate);
};

/**
 * Maps array items and flattens the result
 */
export const flatMap = <T, U>(
  array: T[],
  mapper: (item: T, index: number) => U[]
): U[] => {
  return array.reduce((acc, item, index) => {
    return acc.concat(mapper(item, index));
  }, [] as U[]);
};

/**
 * Creates a range of numbers
 */
export const range = (start: number, end: number, step = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Shuffles an array randomly
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Gets a random item from an array
 */
export const random = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Gets multiple random items from an array
 */
export const randomMultiple = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Removes items from an array that match the predicate
 */
export const remove = <T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): T[] => {
  return array.filter((item, index) => !predicate(item, index));
};

/**
 * Inserts an item at a specific index
 */
export const insert = <T>(array: T[], index: number, item: T): T[] => {
  const result = [...array];
  result.splice(index, 0, item);
  return result;
};

/**
 * Replaces an item at a specific index
 */
export const replace = <T>(array: T[], index: number, item: T): T[] => {
  const result = [...array];
  result[index] = item;
  return result;
};

/**
 * Swaps two items in an array
 */
export const swap = <T>(array: T[], index1: number, index2: number): T[] => {
  const result = [...array];
  [result[index1], result[index2]] = [result[index2], result[index1]];
  return result;
};

/**
 * Moves an item from one index to another
 */
export const move = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const result = [...array];
  const [item] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, item);
  return result;
};

/**
 * Partitions an array into two arrays based on a predicate
 */
export const partition = <T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]] => {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  array.forEach((item, index) => {
    if (predicate(item, index)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });
  
  return [truthy, falsy];
};

/**
 * Creates a sliding window of items
 */
export const slidingWindow = <T>(array: T[], size: number): T[][] => {
  const windows: T[][] = [];
  for (let i = 0; i <= array.length - size; i++) {
    windows.push(array.slice(i, i + size));
  }
  return windows;
};

/**
 * Calculates the intersection of multiple arrays
 */
export const intersection = <T>(...arrays: T[][]): T[] => {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0];
  
  return arrays.reduce((acc, curr) => {
    return acc.filter(item => curr.includes(item));
  });
};

/**
 * Calculates the union of multiple arrays
 */
export const union = <T>(...arrays: T[][]): T[] => {
  return unique(arrays.flat());
};

/**
 * Calculates the difference between arrays (items in first array but not in others)
 */
export const difference = <T>(array1: T[], ...arrays: T[][]): T[] => {
  const otherItems = union(...arrays);
  return array1.filter(item => !otherItems.includes(item));
};

/**
 * Checks if two arrays have the same items (order doesn't matter)
 */
export const isEqual = <T>(array1: T[], array2: T[]): boolean => {
  if (array1.length !== array2.length) return false;
  const sorted1 = [...array1].sort();
  const sorted2 = [...array2].sort();
  return sorted1.every((item, index) => item === sorted2[index]);
};

/**
 * Checks if an array contains all items from another array
 */
export const containsAll = <T>(array: T[], items: T[]): boolean => {
  return items.every(item => array.includes(item));
};

/**
 * Checks if an array contains any item from another array
 */
export const containsAny = <T>(array: T[], items: T[]): boolean => {
  return items.some(item => array.includes(item));
};

/**
 * Creates a frequency map of array items
 */
export const frequency = <T>(array: T[]): Record<string, number> => {
  return array.reduce((acc, item) => {
    const key = String(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Gets the most frequent item in an array
 */
export const mostFrequent = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  
  const freq = frequency(array);
  const maxFreq = Math.max(...Object.values(freq));
  const mostFrequentKey = Object.keys(freq).find(key => freq[key] === maxFreq);
  
  return mostFrequentKey ? (array.find(item => String(item) === mostFrequentKey)) : undefined;
};

/**
 * Creates an array with a default value repeated n times
 */
export const repeat = <T>(value: T, count: number): T[] => {
  return Array(count).fill(value);
};

/**
 * Creates an array from a generator function
 */
export const fromGenerator = <T>(
  generator: () => Generator<T, void, unknown>,
  maxItems?: number
): T[] => {
  const result: T[] = [];
  const gen = generator();
  let count = 0;
  
  for (const item of gen) {
    result.push(item);
    count++;
    if (maxItems && count >= maxItems) break;
  }
  
  return result;
};

/**
 * Creates an array with items that pass the predicate, up to a limit
 */
export const takeWhile = <T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): T[] => {
  const result: T[] = [];
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i], i)) break;
    result.push(array[i]);
  }
  return result;
};

/**
 * Creates an array with items that don't pass the predicate, starting from the first failure
 */
export const dropWhile = <T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): T[] => {
  let startIndex = 0;
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i], i)) {
      startIndex = i;
      break;
    }
  }
  return array.slice(startIndex);
}; 