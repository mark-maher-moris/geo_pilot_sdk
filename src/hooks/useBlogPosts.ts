import { useState, useEffect, useCallback, useRef } from 'react';
import { useAutoBlogify } from './useAutoBlogify';
import {
  BlogPost,
  Pagination,
  UseBlogPostsResult,
  SearchFilters
} from '../types';

export interface UseBlogPostsOptions {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  filters?: SearchFilters;
  autoFetch?: boolean;
  enableInfiniteScroll?: boolean;
}

export function useBlogPosts(options: UseBlogPostsOptions = {}): UseBlogPostsResult {
  const {
    page = 1,
    limit = 10,
    category,
    tag,
    search,
    filters,
    autoFetch = true,
    enableInfiniteScroll = false
  } = options;

  const { api, apiReady } = useAutoBlogify();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentPageRef = useRef(page);

  const fetchPosts = useCallback(async (
    pageNum: number = page,
    append: boolean = false,
    forceRefresh: boolean = false
  ) => {
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

      // Use dedicated search endpoint when search query is provided
      if (search && search.trim()) {
        const response = await api.searchBlogPosts(search, {
          page: pageNum,
          limit,
          filters: {
            category,
            tag,
            sortBy: filters?.sortBy || 'publishedAt',
            sortOrder: filters?.sortOrder || 'desc'
          },
          forceRefresh
        });
        
        if (append && enableInfiniteScroll) {
          setPosts(prevPosts => [...prevPosts, ...response.posts]);
        } else {
          setPosts(response.posts);
        }
        
        setPagination(response.pagination);
        setHasMore(response.pagination.page < response.pagination.pages);
        currentPageRef.current = pageNum;
        return;
      }

      // Use regular posts endpoint for non-search requests
      const requestOptions = {
        page: pageNum,
        limit,
        category,
        tag,
        orderBy: filters?.sortBy || 'publishedAt',
        orderDirection: filters?.sortOrder || 'desc',
        forceRefresh
      };

      const response = await api.getBlogPosts(requestOptions);
      
      if (append && enableInfiniteScroll) {
        setPosts(prevPosts => [...prevPosts, ...response.posts]);
      } else {
        setPosts(response.posts);
      }
      
      setPagination(response.pagination);
      setHasMore(response.pagination.page < response.pagination.pages);
      currentPageRef.current = pageNum;
      
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch blog posts');
        console.error('Error fetching blog posts:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [api, apiReady, page, limit, category, tag, search, filters, enableInfiniteScroll]);

  const refetch = useCallback(async () => {
    await fetchPosts(currentPageRef.current, false, true);
  }, [fetchPosts]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    const nextPage = currentPageRef.current + 1;
    await fetchPosts(nextPage, true);
  }, [hasMore, loading, fetchPosts]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch && api) {
      fetchPosts(page);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, api, apiReady, page, limit, category, tag, search, filters?.sortBy, filters?.sortOrder]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    posts,
    pagination,
    loading,
    error,
    refetch,
    loadMore,
    hasMore
  };
}
