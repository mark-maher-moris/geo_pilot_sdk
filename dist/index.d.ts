export { AutoBlogifyProvider } from './components/AutoBlogifyProvider';
export { AutoBlogifyAPI } from './services/api';
export { BlogFullScreen } from './components/BlogFullScreen';
export { BlogTags } from './components/BlogTags';
export { useBlogPosts } from './hooks/useBlogPosts';
export { useBlogMetadata } from './hooks/useBlogMetadata';
export { useSEO } from './hooks/useSEO';
export { useAutoBlogify } from './hooks/useAutoBlogify';
export type { BlogFullScreenProps, AutoBlogifyConfig, ThemeConfig, SEOConfig, GEOConfig, BlogPost, BlogMetadata, Pagination, BlogPostsResponse, BlogPostResponse, BlogMetadataResponse, MetaTag, AnalyticsData, SearchFilters, ApiResponse, LoadingState, CacheConfig, PerformanceConfig, AutoBlogifyError, AnalyticsEvent, UseBlogPostsResult, UseBlogMetadataResult } from './types';
export * from './utils/themeUtils';
export * from './utils/formatters';
export * from './utils/contentUtils';
export declare const defaultConfig: {
    enableSEO: boolean;
    enableGEO: boolean;
    enableAnalytics: boolean;
    theme: {
        layout: "grid";
        showAuthor: boolean;
        showDate: boolean;
        showReadingTime: boolean;
        showCategories: boolean;
        showTags: boolean;
        showExcerpt: boolean;
        showFeaturedImage: boolean;
    };
    seo: {
        enableStructuredData: boolean;
        enableOpenGraph: boolean;
        enableTwitterCards: boolean;
        enableBreadcrumbs: boolean;
        enableContentFreshness: boolean;
        enablePerformanceOptimizations: boolean;
    };
    geo: {
        enableGeoTargeting: boolean;
        defaultLanguage: string;
        enableAutoTranslation: boolean;
    };
    performance: {
        enableLazyLoading: boolean;
        enableImageOptimization: boolean;
        enableContentPreloading: boolean;
        enableCoreWebVitals: boolean;
        cache: {
            enabled: boolean;
            ttl: number;
            maxSize: number;
        };
    };
};
export declare const SDK_VERSION = "2.2.4";
//# sourceMappingURL=index.d.ts.map