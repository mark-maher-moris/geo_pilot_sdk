import { useState, useCallback, useRef } from 'react';
import { useAutoBlogify } from './useAutoBlogify';
import {
  BlogPost,
  Pagination,
  SearchFilters,
  UseBlogSearchResult
} from '../types';

export function useBlogSearch(): UseBlogSearchResult {
  const { api } = useAutoBlogify();
  const [results, setResults] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentQueryRef = useRef<string>('');
  const currentFiltersRef = useRef<SearchFilters | undefined>();

  const search = useCallback(async (
    query: string,
    filters?: SearchFilters,
    options: {
      page?: number;
      limit?: number;
    } = {}
  ) => {
    if (!api) {
      setError('Auto Blogify API not initialized');
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setPagination({ total: 0, page: 1, limit: 10, pages: 0 });
      setError(null);
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

      const { page = 1, limit = 10 } = options;
      
      const response = await api.searchBlogPosts(query, {
        page,
        limit,
        filters
      });
      
      setResults(response.posts);
      setPagination(response.pagination);
      
      currentQueryRef.current = query;
      currentFiltersRef.current = filters;
      
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Search failed');
        console.error('Error searching blog posts:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [api]);

  const clearSearch = useCallback(() => {
    setResults([]);
    setPagination({ total: 0, page: 1, limit: 10, pages: 0 });
    setError(null);
    currentQueryRef.current = '';
    currentFiltersRef.current = undefined;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const searchMore = useCallback(async (page: number) => {
    if (!currentQueryRef.current) return;
    
    await search(currentQueryRef.current, currentFiltersRef.current, { 
      page,
      limit: pagination.limit 
    });
  }, [search, pagination.limit]);

  return {
    results,
    pagination,
    loading,
    error,
    search,
    clearSearch
  };
}
