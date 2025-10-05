import { AutoBlogifyConfig, BlogPost, BlogPostsResponse, BlogPostResponse, BlogMetadataResponse, BlogCategoriesResponse, BlogTagsResponse, SearchFilters, AnalyticsEvent } from '../types';
export declare class AutoBlogifyAPI {
    private client;
    private config;
    private cache;
    constructor(config: AutoBlogifyConfig);
    /**
     * Get cache key for request
     */
    private getCacheKey;
    /**
     * Get data from cache if valid
     */
    private getFromCache;
    /**
     * Store data in cache
     */
    private setCache;
    /**
     * Make cached GET request
     */
    private cachedGet;
    /**
     * Get published blog posts for the project
     */
    getBlogPosts(options?: {
        page?: number;
        limit?: number;
        category?: string;
        tag?: string;
        search?: string;
        orderBy?: string;
        orderDirection?: 'asc' | 'desc';
        forceRefresh?: boolean;
    }): Promise<BlogPostsResponse>;
    /**
     * Get single blog post by slug
     */
    getBlogPostBySlug(slug: string, forceRefresh?: boolean): Promise<BlogPostResponse>;
    /**
     * Get single blog post by ID
     */
    getBlogPostById(postId: string, forceRefresh?: boolean): Promise<BlogPostResponse>;
    /**
     * Get blog metadata
     */
    getBlogMetadata(forceRefresh?: boolean): Promise<BlogMetadataResponse>;
    /**
     * Get blog categories
     */
    getBlogCategories(forceRefresh?: boolean): Promise<BlogCategoriesResponse>;
    /**
     * Get blog tags
     */
    getBlogTags(forceRefresh?: boolean): Promise<BlogTagsResponse>;
    /**
     * Get related posts for a specific post
     */
    getRelatedPosts(postId: string, limit?: number, forceRefresh?: boolean): Promise<BlogPostsResponse>;
    /**
     * Search blog posts
     */
    searchBlogPosts(query: string, options?: {
        page?: number;
        limit?: number;
        filters?: SearchFilters;
        forceRefresh?: boolean;
    }): Promise<BlogPostsResponse>;
    /**
     * Get recent blog posts
     */
    getRecentBlogPosts(limit?: number, forceRefresh?: boolean): Promise<{
        posts: BlogPost[];
    }>;
    /**
     * Get posts by category
     */
    getPostsByCategory(category: string, options?: {
        page?: number;
        limit?: number;
        forceRefresh?: boolean;
    }): Promise<BlogPostsResponse>;
    /**
     * Get posts by tag
     */
    getPostsByTag(tag: string, options?: {
        page?: number;
        limit?: number;
        forceRefresh?: boolean;
    }): Promise<BlogPostsResponse>;
    /**
     * Track page view for analytics
     */
    trackPageView(postId: string, analyticsData?: {
        userAgent?: string;
        referrer?: string;
        sessionId?: string;
        country?: string;
        region?: string;
        city?: string;
    }): Promise<void>;
    /**
     * Track custom analytics event
     */
    trackEvent(event: AnalyticsEvent): Promise<void>;
    /**
     * Get RSS feed URL
     */
    getRSSFeedUrl(): string;
    /**
     * Get sitemap URL
     */
    getSitemapUrl(): string;
    /**
     * Get blog design configuration for public preview
     */
    getBlogDesignConfig(forceRefresh?: boolean): Promise<{
        design: any;
    }>;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Generate session ID
     */
    private generateSessionId;
    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<AutoBlogifyConfig>): void;
    /**
     * Health check
     */
    healthCheck(): Promise<boolean>;
}
export default AutoBlogifyAPI;
//# sourceMappingURL=api.d.ts.map