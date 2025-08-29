import { useState, useCallback } from 'react';
import { apiService } from '@services/api/client';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApi = (options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      options.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const get = useCallback((url: string, params?: any) => {
    return execute(() => apiService.get(url, params));
  }, [execute]);

  const post = useCallback((url: string, data?: any) => {
    return execute(() => apiService.post(url, data));
  }, [execute]);

  const put = useCallback((url: string, data?: any) => {
    return execute(() => apiService.put(url, data));
  }, [execute]);

  const del = useCallback((url: string) => {
    return execute(() => apiService.delete(url));
  }, [execute]);

  return {
    loading,
    error,
    data,
    execute,
    get,
    post,
    put,
    delete: del,
  };
}; 