import { useState, useEffect, useCallback, useRef } from 'react';
import { AxiosError } from 'axios';
import { ApiResponse } from '../types/teacher';
import { handleApiError, logError } from '../components/shared/ErrorHandler';

/**
 * Options for useApiQuery hook
 */
interface UseApiQueryOptions<T> {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  cacheTime?: number;
}

/**
 * Return type for useApiQuery hook
 */
interface UseApiQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook for data fetching with loading, error states, and automatic cleanup
 * Supports polling, request cancellation, and callbacks
 * 
 * @param queryFn - Function that returns a Promise with API response
 * @param options - Configuration options
 * @returns Object with data, loading, error states and refetch function
 */
export function useApiQuery<T>(
  queryFn: () => Promise<ApiResponse<T>>,
  options: UseApiQueryOptions<T> = {}
): UseApiQueryResult<T> {
  const {
    enabled = true,
    refetchInterval,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await queryFn();
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setData(response.data);
        setLoading(false);
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
    } catch (err) {
      // Only update state if component is still mounted and not aborted
      if (isMountedRef.current && (err as any).name !== 'AbortError') {
        const error = err as AxiosError;
        setError(error as Error);
        setLoading(false);
        
        logError(error, 'useApiQuery');
        
        if (onError) {
          onError(error as Error);
        }
      }
    }
  }, [queryFn, enabled, onSuccess, onError]);

  // Initial fetch and refetch interval setup
  useEffect(() => {
    fetchData();

    // Set up polling if refetchInterval is provided
    if (refetchInterval && refetchInterval > 0) {
      intervalRef.current = setInterval(fetchData, refetchInterval);
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      // Cancel ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, refetchInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Options for useApiMutation hook
 */
interface UseApiMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void;
}

/**
 * Return type for useApiMutation hook
 */
interface UseApiMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  loading: boolean;
  error: Error | null;
  data: TData | null;
  reset: () => void;
}

/**
 * Custom hook for mutations (POST, PUT, DELETE) with loading and error states
 * Supports callbacks for success, error, and settled states
 * 
 * @param mutationFn - Function that performs the mutation
 * @param options - Configuration options
 * @returns Object with mutate function, loading, error states
 */
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseApiMutationOptions<TData, TVariables> = {}
): UseApiMutationResult<TData, TVariables> {
  const { onSuccess, onError, onSettled } = options;

  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      setLoading(true);
      setError(null);

      try {
        const response = await mutationFn(variables);
        setData(response.data);
        setLoading(false);

        if (onSuccess) {
          onSuccess(response.data, variables);
        }

        if (onSettled) {
          onSettled(response.data, null, variables);
        }

        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        setError(error as Error);
        setLoading(false);

        logError(error, 'useApiMutation');
        handleApiError(error);

        if (onError) {
          onError(error as Error, variables);
        }

        if (onSettled) {
          onSettled(undefined, error as Error, variables);
        }

        return undefined;
      }
    },
    [mutationFn, onSuccess, onError, onSettled]
  );

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setLoading(true);
      setError(null);

      try {
        const response = await mutationFn(variables);
        setData(response.data);
        setLoading(false);

        if (onSuccess) {
          onSuccess(response.data, variables);
        }

        if (onSettled) {
          onSettled(response.data, null, variables);
        }

        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        setError(error as Error);
        setLoading(false);

        logError(error, 'useApiMutation');
        handleApiError(error);

        if (onError) {
          onError(error as Error, variables);
        }

        if (onSettled) {
          onSettled(undefined, error as Error, variables);
        }

        throw error;
      }
    },
    [mutationFn, onSuccess, onError, onSettled]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    mutateAsync,
    loading,
    error,
    data,
    reset,
  };
}

/**
 * Hook for debounced value (useful for search inputs)
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for optimistic updates with rollback on error
 * @param initialData - Initial data state
 * @returns Object with data, optimistic update function, and rollback function
 */
export function useOptimisticUpdate<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [previousData, setPreviousData] = useState<T>(initialData);

  const optimisticUpdate = useCallback((newData: T) => {
    setPreviousData(data);
    setData(newData);
  }, [data]);

  const rollback = useCallback(() => {
    setData(previousData);
  }, [previousData]);

  const commit = useCallback((newData: T) => {
    setData(newData);
    setPreviousData(newData);
  }, []);

  return {
    data,
    optimisticUpdate,
    rollback,
    commit,
  };
}
