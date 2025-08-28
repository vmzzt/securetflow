import { SEVERITY_LEVELS, STATUS_TYPES, TARGET_TYPES, SCAN_TYPES } from './constants';

// Type guards
export const isSeverityLevel = (value: string): value is keyof typeof SEVERITY_LEVELS => {
  return Object.values(SEVERITY_LEVELS).includes(value as any);
};

export const isStatusType = (value: string): value is keyof typeof STATUS_TYPES => {
  return Object.values(STATUS_TYPES).includes(value as any);
};

export const isTargetType = (value: string): value is keyof typeof TARGET_TYPES => {
  return Object.values(TARGET_TYPES).includes(value as any);
};

export const isScanType = (value: string): value is keyof typeof SCAN_TYPES => {
  return Object.values(SCAN_TYPES).includes(value as any);
};

// Array helpers
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const uniqueBy = <T, K extends keyof T>(array: T[], key: K): T[] => {
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

export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T, K extends keyof T>(array: T[], key: K, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterBy = <T>(array: T[], predicate: (item: T) => boolean): T[] => {
  return array.filter(predicate);
};

export const findById = <T extends { id: string }>(array: T[], id: string): T | undefined => {
  return array.find(item => item.id === id);
};

export const findIndexById = <T extends { id: string }>(array: T[], id: string): number => {
  return array.findIndex(item => item.id === id);
};

export const removeById = <T extends { id: string }>(array: T[], id: string): T[] => {
  return array.filter(item => item.id !== id);
};

export const updateById = <T extends { id: string }>(array: T[], id: string, updates: Partial<T>): T[] => {
  return array.map(item => item.id === id ? { ...item, ...updates } : item);
};

// Object helpers
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const isNotEmpty = (value: any): boolean => {
  return !isEmpty(value);
};

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

export const merge = <T>(target: T, source: Partial<T>): T => {
  return { ...target, ...source };
};

export const deepMerge = <T>(target: T, source: Partial<T>): T => {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = result[key];
      const sourceValue = source[key];
      
      if (targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue) &&
          sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    }
  }
  
  return result;
};

// String helpers
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const camelCase = (str: string): string => {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
};

export const kebabCase = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

export const snakeCase = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
};

export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatNumber = (num: number, locale: string = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

export const formatCurrency = (amount: number, currency: string = 'BRL', locale: string = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Async helpers
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      await delay(delayMs * attempt);
    }
  }
  
  throw lastError!;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Browser helpers
export const isBrowser = typeof window !== 'undefined';

export const isMobile = (): boolean => {
  if (!isBrowser) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTablet = (): boolean => {
  if (!isBrowser) return false;
  return /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent);
};

export const isDesktop = (): boolean => {
  return !isMobile() && !isTablet();
};

export const getViewportSize = (): { width: number; height: number } => {
  if (!isBrowser) return { width: 0, height: 0 };
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const scrollToTop = (): void => {
  if (isBrowser) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export const scrollToElement = (elementId: string): void => {
  if (isBrowser) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

// Storage helpers
export const getStorageItem = (key: string): string | null => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const setStorageItem = (key: string, value: string): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Handle storage quota exceeded
  }
};

export const removeStorageItem = (key: string): void => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Handle error
  }
};

export const clearStorage = (): void => {
  if (!isBrowser) return;
  try {
    localStorage.clear();
  } catch {
    // Handle error
  }
};

// URL helpers
export const getQueryParams = (): Record<string, string> => {
  if (!isBrowser) return {};
  
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
};

export const setQueryParams = (params: Record<string, string>): void => {
  if (!isBrowser) return;
  
  const url = new URL(window.location.href);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  
  window.history.replaceState({}, '', url.toString());
};

export const removeQueryParams = (keys: string[]): void => {
  if (!isBrowser) return;
  
  const url = new URL(window.location.href);
  
  keys.forEach(key => {
    url.searchParams.delete(key);
  });
  
  window.history.replaceState({}, '', url.toString());
};

// Color helpers
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const lightenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.round(rgb.r * factor));
  const newG = Math.min(255, Math.round(rgb.g * factor));
  const newB = Math.min(255, Math.round(rgb.b * factor));
  
  return rgbToHex(newR, newG, newB);
};

export const darkenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 - percent / 100;
  const newR = Math.max(0, Math.round(rgb.r * factor));
  const newG = Math.max(0, Math.round(rgb.g * factor));
  const newB = Math.max(0, Math.round(rgb.b * factor));
  
  return rgbToHex(newR, newG, newB);
};

export default {
  // Type guards
  isSeverityLevel,
  isStatusType,
  isTargetType,
  isScanType,
  
  // Array helpers
  chunk,
  unique,
  uniqueBy,
  groupBy,
  sortBy,
  filterBy,
  findById,
  findIndexById,
  removeById,
  updateById,
  
  // Object helpers
  pick,
  omit,
  isEmpty,
  isNotEmpty,
  deepClone,
  merge,
  deepMerge,
  
  // String helpers
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  truncate,
  slugify,
  formatBytes,
  formatNumber,
  formatCurrency,
  formatPercentage,
  
  // Validation helpers
  isValidEmail,
  isValidUrl,
  isValidPassword,
  isValidPhone,
  
  // Async helpers
  delay,
  retry,
  debounce,
  throttle,
  
  // Browser helpers
  isBrowser,
  isMobile,
  isTablet,
  isDesktop,
  getViewportSize,
  scrollToTop,
  scrollToElement,
  
  // Storage helpers
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  
  // URL helpers
  getQueryParams,
  setQueryParams,
  removeQueryParams,
  
  // Color helpers
  hexToRgb,
  rgbToHex,
  lightenColor,
  darkenColor,
}; 