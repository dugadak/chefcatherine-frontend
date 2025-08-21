import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError) => void;
  immediate?: boolean;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<any>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiFunction(...args);
        const result = response.data;
        setData(result);
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const error = err as AxiosError;
        setError(error);
        
        if (options.onError) {
          options.onError(error);
        }
        
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
}