import { useState, useMemo, useCallback } from 'react';

export interface PaginationOptions {
  totalItems: number;
  pageSize: number;
  currentPage?: number;
  maxPages?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

export interface PaginationInfo {
  pages: Array<{
    page: number;
    label: string;
    isCurrent: boolean;
    isDisabled: boolean;
  }>;
  pageInfo: string;
  rangeInfo: string;
}

export function usePagination(options: PaginationOptions): [
  PaginationState,
  PaginationActions,
  PaginationInfo
] {
  const {
    totalItems,
    pageSize: initialPageSize,
    currentPage: initialPage = 1,
    maxPages = 7,
    showFirstLast = true,
    showPrevNext = true,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calculate pagination state
  const state = useMemo((): PaginationState => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
    };
  }, [currentPage, pageSize, totalItems]);

  // Pagination actions
  const actions = useMemo((): PaginationActions => {
    return {
      goToPage: (page: number) => {
        if (page >= 1 && page <= state.totalPages) {
          setCurrentPage(page);
        }
      },
      goToNextPage: () => {
        if (state.hasNextPage) {
          setCurrentPage(currentPage + 1);
        }
      },
      goToPrevPage: () => {
        if (state.hasPrevPage) {
          setCurrentPage(currentPage - 1);
        }
      },
      goToFirstPage: () => {
        setCurrentPage(1);
      },
      goToLastPage: () => {
        setCurrentPage(state.totalPages);
      },
      setPageSize: (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when changing page size
      },
      reset: () => {
        setCurrentPage(initialPage);
        setPageSize(initialPageSize);
      },
    };
  }, [currentPage, state.totalPages, state.hasNextPage, state.hasPrevPage, initialPage, initialPageSize]);

  // Generate pagination info
  const info = useMemo((): PaginationInfo => {
    const pages: Array<{
      page: number;
      label: string;
      isCurrent: boolean;
      isDisabled: boolean;
    }> = [];

    const { totalPages } = state;

    if (totalPages <= 0) {
      return {
        pages: [],
        pageInfo: 'No items',
        rangeInfo: 'No items to display',
      };
    }

    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    // Add first page and ellipsis
    if (showFirstLast && startPage > 1) {
      pages.push({
        page: 1,
        label: '1',
        isCurrent: false,
        isDisabled: false,
      });

      if (startPage > 2) {
        pages.push({
          page: startPage - 1,
          label: '...',
          isCurrent: false,
          isDisabled: true,
        });
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push({
        page: i,
        label: i.toString(),
        isCurrent: i === currentPage,
        isDisabled: false,
      });
    }

    // Add last page and ellipsis
    if (showFirstLast && endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push({
          page: endPage + 1,
          label: '...',
          isCurrent: false,
          isDisabled: true,
        });
      }

      pages.push({
        page: totalPages,
        label: totalPages.toString(),
        isCurrent: false,
        isDisabled: false,
      });
    }

    // Add prev/next buttons
    if (showPrevNext) {
      if (state.hasPrevPage) {
        pages.unshift({
          page: currentPage - 1,
          label: '‹',
          isCurrent: false,
          isDisabled: false,
        });
      }

      if (state.hasNextPage) {
        pages.push({
          page: currentPage + 1,
          label: '›',
          isCurrent: false,
          isDisabled: false,
        });
      }
    }

    // Generate info strings
    const pageInfo = `Page ${currentPage} of ${totalPages}`;
    const rangeInfo = totalItems > 0 
      ? `Showing ${state.startIndex + 1} to ${state.endIndex} of ${totalItems} items`
      : 'No items to display';

    return {
      pages,
      pageInfo,
      rangeInfo,
    };
  }, [currentPage, state, maxPages, showFirstLast, showPrevNext]);

  return [state, actions, info];
}

// Hook for paginated data
export function usePaginatedData<T>(
  data: T[],
  options: Omit<PaginationOptions, 'totalItems'>
): [T[], PaginationState, PaginationActions, PaginationInfo] {
  const [paginationState, paginationActions, paginationInfo] = usePagination({
    ...options,
    totalItems: data.length,
  });

  const paginatedData = useMemo(() => {
    const { startIndex, endIndex } = paginationState;
    return data.slice(startIndex, endIndex);
  }, [data, paginationState.startIndex, paginationState.endIndex]);

  return [paginatedData, paginationState, paginationActions, paginationInfo];
}

// Hook for server-side pagination
export function useServerPagination<T>(
  options: PaginationOptions,
  fetchData: (page: number, pageSize: number) => Promise<{
    data: T[];
    totalItems: number;
  }>
): [
  T[],
  PaginationState,
  PaginationActions,
  PaginationInfo,
  {
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
  }
] {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(options.totalItems);

  const [paginationState, paginationActions, paginationInfo] = usePagination({
    ...options,
    totalItems,
  });

  const fetchPaginatedData = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchData(page, pageSize);
      setData(result.data);
      setTotalItems(result.totalItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchPaginatedData(paginationState.currentPage, paginationState.pageSize);
  }, [fetchPaginatedData, paginationState.currentPage, paginationState.pageSize]);

  // Fetch data when pagination changes
  // React.useEffect(() => {
  //   fetchPaginatedData(paginationState.currentPage, paginationState.pageSize);
  // }, [fetchPaginatedData, paginationState.currentPage, paginationState.pageSize]);

  return [
    data,
    paginationState,
    paginationActions,
    paginationInfo,
    { loading, error, refetch },
  ];
}

// Hook for infinite scroll pagination
export function useInfinitePagination<T>(
  options: {
    pageSize: number;
    fetchData: (page: number, pageSize: number) => Promise<{
      data: T[];
      hasMore: boolean;
    }>;
  }
): [
  T[],
  {
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    reset: () => void;
  }
] {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await options.fetchData(currentPage, options.pageSize);
      setData(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setCurrentPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more data');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, options]);

  const reset = useCallback(() => {
    setData([]);
    setLoading(false);
    setError(null);
    setHasMore(true);
    setCurrentPage(1);
  }, []);

  return [
    data,
    {
      loading,
      error,
      hasMore,
      loadMore,
      reset,
    },
  ];
}

export default usePagination; 