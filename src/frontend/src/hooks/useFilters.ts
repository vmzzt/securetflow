import { useState, useMemo, useCallback } from 'react';

export interface FilterOption {
  value: string | number | boolean;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'boolean' | 'search';
  options?: FilterOption[];
  defaultValue?: any;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  dateFormat?: string;
}

export interface FilterState {
  filters: Record<string, any>;
  activeFilters: string[];
  hasActiveFilters: boolean;
}

export interface FilterActions {
  setFilter: (key: string, value: any) => void;
  setFilters: (filters: Record<string, any>) => void;
  clearFilter: (key: string) => void;
  clearAllFilters: () => void;
  resetFilters: () => void;
  toggleFilter: (key: string, value: any) => void;
}

export interface FilterInfo {
  activeFilters: Array<{
    key: string;
    label: string;
    value: any;
    displayValue: string;
  }>;
  filterCount: number;
}

export function useFilters(
  config: FilterConfig[],
  initialFilters: Record<string, any> = {}
): [
  FilterState,
  FilterActions,
  FilterInfo
] {
  const [filters, setFiltersState] = useState<Record<string, any>>(initialFilters);

  // Calculate active filters
  const activeFilters = useMemo(() => {
    return Object.keys(filters).filter(key => {
      const value = filters[key];
      if (value === null || value === undefined || value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'object' && Object.keys(value).length === 0) return false;
      return true;
    });
  }, [filters]);

  const hasActiveFilters = activeFilters.length > 0;

  // Actions
  const actions = useMemo((): FilterActions => ({
    setFilter: (key: string, value: any) => {
      setFiltersState(prev => ({
        ...prev,
        [key]: value,
      }));
    },

    setFilters: (newFilters: Record<string, any>) => {
      setFiltersState(prev => ({
        ...prev,
        ...newFilters,
      }));
    },

    clearFilter: (key: string) => {
      setFiltersState(prev => {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      });
    },

    clearAllFilters: () => {
      setFiltersState({});
    },

    resetFilters: () => {
      setFiltersState(initialFilters);
    },

    toggleFilter: (key: string, value: any) => {
      setFiltersState(prev => {
        const currentValue = prev[key];
        
        if (Array.isArray(currentValue)) {
          // For multiselect filters
          const newValue = currentValue.includes(value)
            ? currentValue.filter(v => v !== value)
            : [...currentValue, value];
          
          return {
            ...prev,
            [key]: newValue,
          };
        } else {
          // For single value filters
          return {
            ...prev,
            [key]: currentValue === value ? null : value,
          };
        }
      });
    },
  }), [initialFilters]);

  // Filter info
  const filterInfo = useMemo((): FilterInfo => {
    const activeFilterInfo = activeFilters.map(key => {
      const configItem = config.find(c => c.key === key);
      const value = filters[key];
      
      let displayValue = String(value);
      
      if (Array.isArray(value)) {
        displayValue = value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        if (value.start !== undefined && value.end !== undefined) {
          displayValue = `${value.start} - ${value.end}`;
        } else {
          displayValue = JSON.stringify(value);
        }
      }

      return {
        key,
        label: configItem?.label || key,
        value,
        displayValue,
      };
    });

    return {
      activeFilters: activeFilterInfo,
      filterCount: activeFilters.length,
    };
  }, [activeFilters, filters, config]);

  const state: FilterState = {
    filters,
    activeFilters,
    hasActiveFilters,
  };

  return [state, actions, filterInfo];
}

// Hook for filtering data
export function useFilteredData<T>(
  data: T[],
  filterConfig: FilterConfig[],
  filterFunction: (item: T, filters: Record<string, any>) => boolean,
  initialFilters: Record<string, any> = {}
): [
  T[],
  FilterState,
  FilterActions,
  FilterInfo
] {
  const [filterState, filterActions, filterInfo] = useFilters(filterConfig, initialFilters);

  const filteredData = useMemo(() => {
    if (!filterState.hasActiveFilters) {
      return data;
    }

    return data.filter(item => filterFunction(item, filterState.filters));
  }, [data, filterState.filters, filterState.hasActiveFilters, filterFunction]);

  return [filteredData, filterState, filterActions, filterInfo];
}

// Hook for range filters
export function useRangeFilter<T>(
  data: T[],
  rangeConfig: {
    key: string;
    label: string;
    getValue: (item: T) => number;
    min?: number;
    max?: number;
    step?: number;
  }
): [
  T[],
  {
    range: { min: number; max: number };
    currentRange: { min: number; max: number };
    setRange: (min: number, max: number) => void;
    resetRange: () => void;
  }
] {
  const [currentRange, setCurrentRange] = useState<{ min: number; max: number }>({
    min: rangeConfig.min || 0,
    max: rangeConfig.max || 100,
  });

  // Calculate actual range from data
  const actualRange = useMemo(() => {
    if (data.length === 0) {
      return { min: rangeConfig.min || 0, max: rangeConfig.max || 100 };
    }

    const values = data.map(rangeConfig.getValue);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [data, rangeConfig]);

  // Filter data based on range
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const value = rangeConfig.getValue(item);
      return value >= currentRange.min && value <= currentRange.max;
    });
  }, [data, currentRange, rangeConfig]);

  const actions = {
    range: actualRange,
    currentRange,
    setRange: (min: number, max: number) => {
      setCurrentRange({ min, max });
    },
    resetRange: () => {
      setCurrentRange(actualRange);
    },
  };

  return [filteredData, actions];
}

// Hook for date range filters
export function useDateRangeFilter<T>(
  data: T[],
  dateConfig: {
    key: string;
    label: string;
    getDate: (item: T) => Date;
    format?: string;
  }
): [
  T[],
  {
    dateRange: { start: Date | null; end: Date | null };
    setDateRange: (start: Date | null, end: Date | null) => void;
    clearDateRange: () => void;
  }
] {
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const filteredData = useMemo(() => {
    if (!dateRange.start && !dateRange.end) {
      return data;
    }

    return data.filter(item => {
      const itemDate = dateConfig.getDate(item);
      
      if (dateRange.start && itemDate < dateRange.start) {
        return false;
      }
      
      if (dateRange.end && itemDate > dateRange.end) {
        return false;
      }
      
      return true;
    });
  }, [data, dateRange, dateConfig]);

  const actions = {
    dateRange,
    setDateRange: (start: Date | null, end: Date | null) => {
      setDateRange({ start, end });
    },
    clearDateRange: () => {
      setDateRange({ start: null, end: null });
    },
  };

  return [filteredData, actions];
}

// Hook for search filters
export function useSearchFilter<T>(
  data: T[],
  searchConfig: {
    key: string;
    label: string;
    searchFields: (keyof T)[];
    caseSensitive?: boolean;
    debounceMs?: number;
  }
): [
  T[],
  {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    clearSearch: () => void;
    loading: boolean;
  }
] {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchConfig.caseSensitive 
      ? searchQuery 
      : searchQuery.toLowerCase();

    return data.filter(item => {
      return searchConfig.searchFields.some(field => {
        const fieldValue = item[field];
        if (fieldValue === null || fieldValue === undefined) return false;

        const stringValue = String(fieldValue);
        const normalizedValue = searchConfig.caseSensitive 
          ? stringValue 
          : stringValue.toLowerCase();

        return normalizedValue.includes(query);
      });
    });
  }, [data, searchQuery, searchConfig]);

  const actions = {
    searchQuery,
    setSearchQuery: (query: string) => {
      setSearchQuery(query);
    },
    clearSearch: () => {
      setSearchQuery('');
    },
    loading,
  };

  return [filteredData, actions];
}

// Hook for combined filters
export function useCombinedFilters<T>(
  data: T[],
  filterConfigs: {
    range?: Array<{
      key: string;
      label: string;
      getValue: (item: T) => number;
      min?: number;
      max?: number;
      step?: number;
    }>;
    dateRange?: Array<{
      key: string;
      label: string;
      getDate: (item: T) => Date;
      format?: string;
    }>;
    search?: Array<{
      key: string;
      label: string;
      searchFields: (keyof T)[];
      caseSensitive?: boolean;
    }>;
    custom?: Array<{
      key: string;
      label: string;
      filterFunction: (item: T, value: any) => boolean;
    }>;
  }
): [
  T[],
  {
    filters: Record<string, any>;
    setFilter: (key: string, value: any) => void;
    clearFilter: (key: string) => void;
    clearAllFilters: () => void;
    resetFilters: () => void;
  }
] {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Apply range filters
      if (filterConfigs.range) {
        for (const rangeConfig of filterConfigs.range) {
          const range = filters[rangeConfig.key];
          if (range && (range.min !== undefined || range.max !== undefined)) {
            const value = rangeConfig.getValue(item);
            if (range.min !== undefined && value < range.min) return false;
            if (range.max !== undefined && value > range.max) return false;
          }
        }
      }

      // Apply date range filters
      if (filterConfigs.dateRange) {
        for (const dateConfig of filterConfigs.dateRange) {
          const dateRange = filters[dateConfig.key];
          if (dateRange && (dateRange.start || dateRange.end)) {
            const itemDate = dateConfig.getDate(item);
            if (dateRange.start && itemDate < dateRange.start) return false;
            if (dateRange.end && itemDate > dateRange.end) return false;
          }
        }
      }

      // Apply search filters
      if (filterConfigs.search) {
        for (const searchConfig of filterConfigs.search) {
          const query = filters[searchConfig.key];
          if (query && query.trim()) {
            const normalizedQuery = searchConfig.caseSensitive 
              ? query 
              : query.toLowerCase();
            
            const hasMatch = searchConfig.searchFields.some(field => {
              const fieldValue = item[field];
              if (fieldValue === null || fieldValue === undefined) return false;

              const stringValue = String(fieldValue);
              const normalizedValue = searchConfig.caseSensitive 
                ? stringValue 
                : stringValue.toLowerCase();

              return normalizedValue.includes(normalizedQuery);
            });

            if (!hasMatch) return false;
          }
        }
      }

      // Apply custom filters
      if (filterConfigs.custom) {
        for (const customConfig of filterConfigs.custom) {
          const value = filters[customConfig.key];
          if (value !== undefined && value !== null && value !== '') {
            if (!customConfig.filterFunction(item, value)) return false;
          }
        }
      }

      return true;
    });
  }, [data, filters, filterConfigs]);

  const actions = {
    filters,
    setFilter: (key: string, value: any) => {
      setFilters(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    clearFilter: (key: string) => {
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      });
    },
    clearAllFilters: () => {
      setFilters({});
    },
    resetFilters: () => {
      setFilters({});
    },
  };

  return [filteredData, actions];
}

export default useFilters; 