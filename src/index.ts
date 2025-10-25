// Main SDK exports - Simplified to focus on BlogFullScreen component
export { GEOPilotProvider } from './components/GEOPilotProvider';
export { GEOPilotAPI } from './services/api';

// Main component - BlogFullScreen is the primary component for easy integration
export { BlogFullScreen } from './components/BlogFullScreen';

// Additional components for advanced usage
export { BlogTags } from './components/BlogTags';

// Essential hooks for BlogFullScreen functionality
export { useBlogPosts } from './hooks/useBlogPosts';
export { useBlogMetadata } from './hooks/useBlogMetadata';
export { useSEO } from './hooks/useSEO';
export { useGEOPilot } from './hooks/useGEOPilot';

// Essential types for BlogFullScreen
export type {
  BlogFullScreenProps,
  GEOPilotConfig,
  ThemeConfig,
  SEOConfig,
  GEOConfig,
  BlogPost,
  BlogMetadata,
  Pagination,
  BlogPostsResponse,
  BlogPostResponse,
  BlogMetadataResponse,
  MetaTag,
  AnalyticsData,
  SearchFilters,
  ApiResponse,
  LoadingState,
  CacheConfig,
  PerformanceConfig,
  GEOPilotError,
  AnalyticsEvent,
  UseBlogPostsResult,
  UseBlogMetadataResult
} from './types';

// Essential utils for BlogFullScreen
export * from './utils/themeUtils';
export * from './utils/formatters';
export * from './utils/contentUtils';

// Default configuration
export const defaultConfig = {
  enableSEO: true,
  enableGEO: true,
  enableAnalytics: true,
  theme: {
    layout: 'grid' as const,
    showAuthor: true,
    showDate: true,
    showReadingTime: true,
    showCategories: true,
    showTags: false,
    showExcerpt: true,
    showFeaturedImage: true,
  },
  seo: {
    enableStructuredData: true,
    enableOpenGraph: true,
    enableTwitterCards: true,
    enableBreadcrumbs: true,
    enableContentFreshness: true,
    enablePerformanceOptimizations: true,
  },
  geo: {
    enableGeoTargeting: false,
    defaultLanguage: 'en',
    enableAutoTranslation: false,
  },
  performance: {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableContentPreloading: true,
    enableCoreWebVitals: true,
    cache: {
      enabled: true,
      ttl: 300000, // 5 minutes
      maxSize: 100
    }
  }
};

// Version
export const SDK_VERSION = '2.2.4';
