import { useState, useCallback, useRef } from 'react';
import { getAuthHeader } from '@utils/auth';
import { logApi, logError } from '@utils/logger';
import { checkApiRateLimit, getApiRemaining } from '@utils/rateLimiter';

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseURL: string = '/api', timeout: number = 30000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
      retries = 3,
      retryDelay = 1000,
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    // Add auth token if available (using secure auth manager)
    const authHeader = getAuthHeader();
    if (authHeader) {
      requestHeaders.Authorization = authHeader;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout');
        }

        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error('Request failed');
  }

  async get<T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Global API client instance
export const apiClient = new ApiClient();

export function useApi<T = any>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (
    requestFn: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: string) => void;
    }
  ) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await requestFn();
      
      if (!abortControllerRef.current?.signal.aborted) {
        setState({ data, error: null, loading: false });
        options?.onSuccess?.(data);
      }
    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        options?.onError?.(errorMessage);
      }
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
    cancel,
  };
}

// Convenience hooks for common HTTP methods
export function useGet<T = any>(endpoint: string, options?: {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}) {
  const api = useApi<T>();

  const get = useCallback(() => {
    return api.execute(() => apiClient.get<T>(endpoint), options);
  }, [endpoint, api, options]);

  return { ...api, get };
}

export function usePost<T = any>(endpoint: string, options?: {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}) {
  const api = useApi<T>();

  const post = useCallback((body?: any) => {
    return api.execute(() => apiClient.post<T>(endpoint, body), options);
  }, [endpoint, api, options]);

  return { ...api, post };
}

export function usePut<T = any>(endpoint: string, options?: {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}) {
  const api = useApi<T>();

  const put = useCallback((body?: any) => {
    return api.execute(() => apiClient.put<T>(endpoint, body), options);
  }, [endpoint, api, options]);

  return { ...api, put };
}

export function useDelete<T = any>(endpoint: string, options?: {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}) {
  const api = useApi<T>();

  const del = useCallback(() => {
    return api.execute(() => apiClient.delete<T>(endpoint), options);
  }, [endpoint, api, options]);

  return { ...api, delete: del };
}

export default useApi; 