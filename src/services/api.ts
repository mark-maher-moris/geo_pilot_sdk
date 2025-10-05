import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  AutoBlogifyConfig,
  BlogPost,
  BlogPostsResponse,
  BlogPostResponse,
  BlogMetadataResponse,
  BlogCategoriesResponse,
  BlogTagsResponse,
  SearchFilters,
  ApiResponse,
  AutoBlogifyError,
  AnalyticsEvent
} from '../types';

export class AutoBlogifyAPI {
  private client: AxiosInstance;
  private config: AutoBlogifyConfig;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;

  constructor(config: AutoBlogifyConfig) {
    this.config = config;
    this.cache = new Map();
    
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'X-API-Key': config.apiKey })
      }
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add language header if specified
        if (this.config.language) {
          config.headers['Accept-Language'] = this.config.language;
        }
        
        // Add timezone header if specified
        if (this.config.timezone) {
          config.headers['X-Timezone'] = this.config.timezone;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.error?.message || error.message;
        const code = error.response?.data?.error?.code;
        const statusCode = error.response?.status;
        
        throw new AutoBlogifyError(message, code, statusCode);
      }
    );
  }

  /**
   * Get cache key for request
   */
  private getCacheKey(endpoint: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramString}`;
  }

  /**
   * Get data from cache if valid
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  /**
   * Store data in cache
   */
  private setCache(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Make cached GET request
   */
  private async cachedGet<T>(
    endpoint: string, 
    params?: any, 
    ttl?: number,
    forceRefresh: boolean = false
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    if (!forceRefresh) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) return cached;
    }

    const response = await this.client.get<ApiResponse<T>>(endpoint, { params });
    
    if (!response.data.success) {
      throw new AutoBlogifyError(
        response.data.error?.message || 'Request failed',
        response.data.error?.code
      );
    }

    this.setCache(cacheKey, response.data.data, ttl);
    return response.data.data;
  }

  /**
   * Get published blog posts for the project
   */
  async getBlogPosts(options: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    forceRefresh?: boolean;
  } = {}): Promise<BlogPostsResponse> {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      search,
      orderBy = 'publishedAt',
      orderDirection = 'desc',
      forceRefresh = false
    } = options;

    const params = {
      page,
      limit,
      orderBy,
      orderDirection,
      ...(category && { category }),
      ...(tag && { tag }),
      ...(search && { search })
    };

    return this.cachedGet<BlogPostsResponse>(
      `/public/projects/${this.config.projectId}/posts`,
      params,
      300000, // 5 minutes cache
      forceRefresh
    );
  }

  /**
   * Get single blog post by slug
   */
  async getBlogPostBySlug(slug: string, forceRefresh: boolean = false): Promise<BlogPostResponse> {
    return this.cachedGet<BlogPostResponse>(
      `/public/projects/${this.config.projectId}/posts/${slug}`,
      undefined,
      600000, // 10 minutes cache
      forceRefresh
    );
  }

  /**
   * Get single blog post by ID
   */
  async getBlogPostById(postId: string, forceRefresh: boolean = false): Promise<BlogPostResponse> {
    return this.cachedGet<BlogPostResponse>(
      `/public/posts/${postId}`,
      undefined,
      600000, // 10 minutes cache
      forceRefresh
    );
  }

  /**
   * Get blog metadata
   */
  async getBlogMetadata(forceRefresh: boolean = false): Promise<BlogMetadataResponse> {
    return this.cachedGet<BlogMetadataResponse>(
      `/public/projects/${this.config.projectId}/metadata`,
      undefined,
      1800000, // 30 minutes cache
      forceRefresh
    );
  }

  /**
   * Get blog categories
   */
  async getBlogCategories(forceRefresh: boolean = false): Promise<BlogCategoriesResponse> {
    return this.cachedGet<BlogCategoriesResponse>(
      `/public/projects/${this.config.projectId}/categories`,
      undefined,
      900000, // 15 minutes cache
      forceRefresh
    );
  }

  /**
   * Get blog tags
   */
  async getBlogTags(forceRefresh: boolean = false): Promise<BlogTagsResponse> {
    return this.cachedGet<BlogTagsResponse>(
      `/public/projects/${this.config.projectId}/tags`,
      undefined,
      900000, // 15 minutes cache
      forceRefresh
    );
  }

  /**
   * Get related posts for a specific post
   */
  async getRelatedPosts(postId: string, limit: number = 3, forceRefresh: boolean = false): Promise<BlogPostsResponse> {
    return this.cachedGet<BlogPostsResponse>(
      `/public/projects/${this.config.projectId}/posts/${postId}/related`,
      { limit },
      600000, // 10 minutes cache
      forceRefresh
    );
  }

  /**
   * Search blog posts
   */
  async searchBlogPosts(
    query: string,
    options: {
      page?: number;
      limit?: number;
      filters?: SearchFilters;
      forceRefresh?: boolean;
    } = {}
  ): Promise<BlogPostsResponse> {
    const { page = 1, limit = 10, filters, forceRefresh = false } = options;

    const params = {
      q: query,
      page,
      limit,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.tag && { tag: filters.tag }),
      ...(filters?.author && { author: filters.author }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo }),
      ...(filters?.sortBy && { sortBy: filters.sortBy }),
      ...(filters?.sortOrder && { sortOrder: filters.sortOrder })
    };

    return this.cachedGet<BlogPostsResponse>(
      `/public/projects/${this.config.projectId}/search`,
      params,
      60000, // 1 minute cache for search results
      forceRefresh
    );
  }

  /**
   * Get recent blog posts
   */
  async getRecentBlogPosts(limit: number = 5, forceRefresh: boolean = false): Promise<{ posts: BlogPost[] }> {
    return this.cachedGet<{ posts: BlogPost[] }>(
      `/public/projects/${this.config.projectId}/recent`,
      { limit },
      300000, // 5 minutes cache
      forceRefresh
    );
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(
    category: string,
    options: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
    } = {}
  ): Promise<BlogPostsResponse> {
    const { page = 1, limit = 10, forceRefresh = false } = options;

    return this.cachedGet<BlogPostsResponse>(
      `/public/projects/${this.config.projectId}/categories/${encodeURIComponent(category)}/posts`,
      { page, limit },
      300000, // 5 minutes cache
      forceRefresh
    );
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(
    tag: string,
    options: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
    } = {}
  ): Promise<BlogPostsResponse> {
    const { page = 1, limit = 10, forceRefresh = false } = options;

    return this.cachedGet<BlogPostsResponse>(
      `/public/projects/${this.config.projectId}/tags/${encodeURIComponent(tag)}/posts`,
      { page, limit },
      300000, // 5 minutes cache
      forceRefresh
    );
  }

  /**
   * Track page view for analytics
   */
  async trackPageView(postId: string, analyticsData?: {
    userAgent?: string;
    referrer?: string;
    sessionId?: string;
    country?: string;
    region?: string;
    city?: string;
  }): Promise<void> {
    try {
      await this.client.post(`/public/posts/${postId}/view`, {
        userAgent: analyticsData?.userAgent || navigator.userAgent,
        referrer: analyticsData?.referrer || document.referrer,
        sessionId: analyticsData?.sessionId || this.generateSessionId(),
        country: analyticsData?.country,
        region: analyticsData?.region,
        city: analyticsData?.city
      });
    } catch (error) {
      // Analytics tracking should not break the app
      console.warn('Failed to track page view:', error);
    }
  }

  /**
   * Track custom analytics event
   */
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.config.enableAnalytics) return;

    try {
      await this.client.post('/public/analytics/event', {
        ...event,
        projectId: this.config.projectId,
        timestamp: event.timestamp || new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to track event:', error);
    }
  }

  /**
   * Get RSS feed URL
   */
  getRSSFeedUrl(): string {
    return `${this.config.apiUrl}/public/projects/${this.config.projectId}/rss`;
  }

  /**
   * Get sitemap URL
   */
  getSitemapUrl(): string {
    return `${this.config.apiUrl}/public/projects/${this.config.projectId}/sitemap`;
  }

  /**
   * Get blog design configuration for public preview
   */
  async getBlogDesignConfig(forceRefresh: boolean = false): Promise<{ design: any }> {
    return this.cachedGet<{ design: any }>(
      `/blog-design/${this.config.projectId}/public-preview`,
      undefined,
      300000, // 5 minutes cache
      forceRefresh
    );
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AutoBlogifyConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update client base URL if changed
    if (newConfig.apiUrl) {
      this.client.defaults.baseURL = newConfig.apiUrl;
    }
    
    // Update headers if API key changed
    if (newConfig.apiKey) {
      this.client.defaults.headers['X-API-Key'] = newConfig.apiKey;
    }
    
    // Clear cache when config changes
    this.clearCache();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default AutoBlogifyAPI;
