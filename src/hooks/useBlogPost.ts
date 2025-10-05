import { useState, useEffect, useCallback, useRef } from 'react';
import { useAutoBlogify } from './useAutoBlogify';
import {
  BlogPost,
  UseBlogPostResult
} from '../types';

export interface UseBlogPostOptions {
  postId?: string;
  slug?: string;
  autoFetch?: boolean;
  trackView?: boolean;
}

export function useBlogPost(options: UseBlogPostOptions = {}): UseBlogPostResult {
  const {
    postId,
    slug,
    autoFetch = true,
    trackView = true
  } = options;

  const { api } = useAutoBlogify();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const viewTrackedRef = useRef(false);

  const fetchPost = useCallback(async (forceRefresh: boolean = false) => {
    if (!api || (!postId && !slug)) {
      setError(!api ? 'Auto Blogify API not initialized' : 'Post ID or slug is required');
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

      let response;
      
      if (slug) {
        response = await api.getBlogPostBySlug(slug, forceRefresh);
      } else if (postId) {
        response = await api.getBlogPostById(postId, forceRefresh);
      }

      if (response) {
        setPost(response.post);
        
        // Track page view once per session
        if (trackView && !viewTrackedRef.current) {
          try {
            await api.trackPageView(response.post.id);
            viewTrackedRef.current = true;
          } catch (trackError) {
            // Don't fail the whole request if tracking fails
            console.warn('Failed to track page view:', trackError);
          }
        }
      }
      
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch blog post');
        console.error('Error fetching blog post:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [api, postId, slug, trackView]);

  const refetch = useCallback(async () => {
    viewTrackedRef.current = false; // Reset tracking for refetch
    await fetchPost(true);
  }, [fetchPost]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch && (postId || slug)) {
      fetchPost();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, postId, slug]);

  // Reset state when identifiers change
  useEffect(() => {
    setPost(null);
    setError(null);
    viewTrackedRef.current = false;
  }, [postId, slug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    post,
    loading,
    error,
    refetch
  };
}
