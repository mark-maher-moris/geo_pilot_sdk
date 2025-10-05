import { useState, useEffect, useCallback, useRef } from 'react';
import { useAutoBlogify } from './useAutoBlogify';
import {
  BlogMetadata,
  UseBlogMetadataResult
} from '../types';

export interface UseBlogMetadataOptions {
  autoFetch?: boolean;
}

export function useBlogMetadata(options: UseBlogMetadataOptions = {}): UseBlogMetadataResult {
  const { autoFetch = true } = options;
  const { api, apiReady } = useAutoBlogify();
  const [metadata, setMetadata] = useState<BlogMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMetadata = useCallback(async (forceRefresh: boolean = false) => {
    if (!api || !apiReady) {
      // Don't set error if API is not initialized yet - just return silently
      // The hook will retry when the API becomes available
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);

      const response = await api.getBlogMetadata(forceRefresh);
      setMetadata(response.metadata);
      
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch blog metadata');
        console.error('Error fetching blog metadata:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [api, apiReady]);

  const refetch = useCallback(async () => {
    await fetchMetadata(true);
  }, [fetchMetadata]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && api) {
      fetchMetadata();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, api, apiReady, fetchMetadata]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    metadata,
    loading,
    error,
    refetch
  };
}
