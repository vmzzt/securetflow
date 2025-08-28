import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export interface SearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  debounceMs?: number;
  caseSensitive?: boolean;
  exactMatch?: boolean;
  minSearchLength?: number;
  highlightMatches?: boolean;
}

export interface SearchResult<T> {
  item: T;
  score: number;
  matches: Array<{
    field: keyof T;
    value: string;
    highlightedValue?: string;
  }>;
}

export interface SearchState {
  query: string;
  results: SearchResult<any>[];
  loading: boolean;
  hasSearched: boolean;
  totalResults: number;
  searchTime: number;
}

export interface SearchActions {
  setQuery: (query: string) => void;
  clearSearch: () => void;
  search: (query: string) => void;
  reset: () => void;
}

export function useSearch<T>(options: SearchOptions<T>): [
  SearchState,
  SearchActions
] {
  const {
    data,
    searchFields,
    debounceMs = 300,
    caseSensitive = false,
    exactMatch = false,
    minSearchLength = 1,
    highlightMatches = false,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  const debouncedQuery = useDebounce(query, debounceMs);

  // Search function
  const performSearch = useCallback((searchQuery: string): SearchResult<T>[] => {
    if (!searchQuery.trim() || searchQuery.length < minSearchLength) {
      return [];
    }

    const startTime = performance.now();
    const searchResults: SearchResult<T>[] = [];

    const normalizedQuery = caseSensitive ? searchQuery : searchQuery.toLowerCase();

    for (const item of data) {
      const matches: Array<{
        field: keyof T;
        value: string;
        highlightedValue?: string;
      }> = [];
      let totalScore = 0;

      for (const field of searchFields) {
        const fieldValue = item[field];
        if (fieldValue === null || fieldValue === undefined) continue;

        const stringValue = String(fieldValue);
        const normalizedValue = caseSensitive ? stringValue : stringValue.toLowerCase();

        let isMatch = false;
        let score = 0;

        if (exactMatch) {
          isMatch = normalizedValue === normalizedQuery;
          if (isMatch) score = 100;
        } else {
          // Check for exact match first (highest score)
          if (normalizedValue === normalizedQuery) {
            isMatch = true;
            score = 100;
          }
          // Check for starts with (high score)
          else if (normalizedValue.startsWith(normalizedQuery)) {
            isMatch = true;
            score = 80;
          }
          // Check for contains (medium score)
          else if (normalizedValue.includes(normalizedQuery)) {
            isMatch = true;
            score = 60;
          }
          // Check for word boundaries (lower score)
          else {
            const words = normalizedValue.split(/\s+/);
            for (const word of words) {
              if (word.startsWith(normalizedQuery)) {
                isMatch = true;
                score = 40;
                break;
              }
            }
          }
        }

        if (isMatch) {
          let highlightedValue = stringValue;
          if (highlightMatches && !exactMatch) {
            const regex = new RegExp(`(${searchQuery})`, caseSensitive ? 'g' : 'gi');
            highlightedValue = stringValue.replace(regex, '<mark>$1</mark>');
          }

          matches.push({
            field,
            value: stringValue,
            highlightedValue,
          });

          totalScore += score;
        }
      }

      if (matches.length > 0) {
        searchResults.push({
          item,
          score: totalScore,
          matches,
        });
      }
    }

    // Sort by score (highest first)
    searchResults.sort((a, b) => b.score - a.score);

    const endTime = performance.now();
    setSearchTime(endTime - startTime);

    return searchResults;
  }, [data, searchFields, caseSensitive, exactMatch, minSearchLength, highlightMatches]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery !== query) return;

    setLoading(true);
    setHasSearched(true);

    // Use setTimeout to simulate async search (for better UX)
    const timeoutId = setTimeout(() => {
      const searchResults = performSearch(debouncedQuery);
      setResults(searchResults);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [debouncedQuery, performSearch]);

  // Actions
  const actions = useMemo((): SearchActions => ({
    setQuery: (newQuery: string) => {
      setQuery(newQuery);
    },
    clearSearch: () => {
      setQuery('');
      setResults([]);
      setHasSearched(false);
      setSearchTime(0);
    },
    search: (searchQuery: string) => {
      setQuery(searchQuery);
    },
    reset: () => {
      setQuery('');
      setResults([]);
      setLoading(false);
      setHasSearched(false);
      setSearchTime(0);
    },
  }), []);

  const state: SearchState = {
    query,
    results,
    loading,
    hasSearched,
    totalResults: results.length,
    searchTime,
  };

  return [state, actions];
}

// Hook for async search
export function useAsyncSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  options: {
    debounceMs?: number;
    minSearchLength?: number;
    enabled?: boolean;
  } = {}
): [
  {
    query: string;
    results: T[];
    loading: boolean;
    error: string | null;
    hasSearched: boolean;
  },
  {
    setQuery: (query: string) => void;
    search: (query: string) => void;
    clearSearch: () => void;
    reset: () => void;
  }
] {
  const {
    debounceMs = 300,
    minSearchLength = 1,
    enabled = true,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, debounceMs);

  // Perform async search
  useEffect(() => {
    if (!enabled || debouncedQuery !== query) return;

    const performSearch = async () => {
      if (!query.trim() || query.length < minSearchLength) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const searchResults = await searchFunction(query);
        setResults(searchResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, searchFunction, enabled, minSearchLength, query]);

  const actions = {
    setQuery: (newQuery: string) => {
      setQuery(newQuery);
    },
    search: (searchQuery: string) => {
      setQuery(searchQuery);
    },
    clearSearch: () => {
      setQuery('');
      setResults([]);
      setError(null);
      setHasSearched(false);
    },
    reset: () => {
      setQuery('');
      setResults([]);
      setLoading(false);
      setError(null);
      setHasSearched(false);
    },
  };

  return [
    {
      query,
      results,
      loading,
      error,
      hasSearched,
    },
    actions,
  ];
}

// Hook for search with filters
export function useSearchWithFilters<T>(
  options: SearchOptions<T> & {
    filters?: Record<string, any>;
    filterFunction?: (item: T, filters: Record<string, any>) => boolean;
  }
): [
  SearchState & { filteredResults: SearchResult<T>[] },
  SearchActions & {
    setFilters: (filters: Record<string, any>) => void;
    clearFilters: () => void;
  }
] {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchState, searchActions] = useSearch(options);

  const filteredResults = useMemo(() => {
    if (!options.filterFunction || Object.keys(filters).length === 0) {
      return searchState.results;
    }

    return searchState.results.filter(result => 
      options.filterFunction!(result.item, filters)
    );
  }, [searchState.results, filters, options.filterFunction]);

  const actions = {
    ...searchActions,
    setFilters: (newFilters: Record<string, any>) => {
      setFilters(newFilters);
    },
    clearFilters: () => {
      setFilters({});
    },
  };

  return [
    {
      ...searchState,
      filteredResults,
    },
    actions,
  ];
}

// Hook for search suggestions
export function useSearchSuggestions<T>(
  options: {
    data: T[];
    searchFields: (keyof T)[];
    maxSuggestions?: number;
    minQueryLength?: number;
  }
): [
  string[],
  (query: string) => void
] {
  const {
    data,
    searchFields,
    maxSuggestions = 5,
    minQueryLength = 2,
  } = options;

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = useCallback((query: string) => {
    if (query.length < minQueryLength) {
      setSuggestions([]);
      return;
    }

    const suggestionSet = new Set<string>();
    const normalizedQuery = query.toLowerCase();

    for (const item of data) {
      for (const field of searchFields) {
        const fieldValue = item[field];
        if (fieldValue === null || fieldValue === undefined) continue;

        const stringValue = String(fieldValue);
        const normalizedValue = stringValue.toLowerCase();

        if (normalizedValue.includes(normalizedQuery)) {
          // Extract the matching part
          const index = normalizedValue.indexOf(normalizedQuery);
          const suggestion = stringValue.substring(index, index + query.length + 20);
          suggestionSet.add(suggestion);

          if (suggestionSet.size >= maxSuggestions) {
            break;
          }
        }
      }

      if (suggestionSet.size >= maxSuggestions) {
        break;
      }
    }

    setSuggestions(Array.from(suggestionSet).slice(0, maxSuggestions));
  }, [data, searchFields, maxSuggestions, minQueryLength]);

  return [suggestions, generateSuggestions];
}

export default useSearch; 