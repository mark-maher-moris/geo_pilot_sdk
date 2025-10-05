// Core types for the Auto Blogify SDK

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  categories?: string[];
  tags?: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime?: number;
  wordCount?: number;
  authorName?: string;
  author?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface BlogMetadata {
  projectId: string;
  projectName: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  defaultAuthor?: string;
  language?: string;
  timezone?: string;
  postsPerPage: number;
  totalPosts: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  pagination: Pagination;
}

export interface BlogPostResponse {
  post: BlogPost;
}

export interface BlogMetadataResponse {
  metadata: BlogMetadata;
}

export interface BlogCategoriesResponse {
  categories: string[];
}

export interface BlogTagsResponse {
  tags: string[];
}

export interface AutoBlogifyConfig {
  apiUrl: string;
  projectId: string;
  apiKey?: string;
  language?: string;
  timezone?: string;
  enableSEO?: boolean;
  enableGEO?: boolean;
  enableAnalytics?: boolean;
  customDomain?: string;
  theme?: ThemeConfig;
  seo?: SEOConfig;
  geo?: GEOConfig;
  // Dynamic design configuration from dashboard
  design?: BlogDesignConfig;
}

export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  fontSize?: string;
  customCSS?: string;
  layout?: 'grid' | 'list' | 'masonry' | 'mosaic';
  showAuthor?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showExcerpt?: boolean;
  showFeaturedImage?: boolean;
}

export interface SEOConfig {
  enableStructuredData?: boolean;
  enableOpenGraph?: boolean;
  enableTwitterCards?: boolean;
  customMetaTags?: MetaTag[];
  canonicalUrl?: string;
}

export interface GEOConfig {
  enableGeoTargeting?: boolean;
  defaultCountry?: string;
  defaultLanguage?: string;
  enableAutoTranslation?: boolean;
  supportedCountries?: string[];
  supportedLanguages?: string[];
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface AnalyticsData {
  views: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  lastUpdated: string;
}

export interface SearchFilters {
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'publishedAt' | 'title' | 'readingTime' | 'wordCount';
  sortOrder?: 'asc' | 'desc';
}

export interface BlogComponentProps {
  config: AutoBlogifyConfig;
  className?: string;
  style?: any;
}

export interface BlogListProps extends BlogComponentProps {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  searchQuery?: string;
  filters?: SearchFilters;
  onPostClick?: (post: BlogPost) => void;
  showPagination?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
}

export interface BlogPostProps extends BlogComponentProps {
  postId?: string;
  slug?: string;
  onBack?: () => void;
  showRelatedPosts?: boolean;
  enableComments?: boolean;
  enableSharing?: boolean;
}

export interface BlogSearchProps extends BlogComponentProps {
  onSearch?: (query: string, filters?: SearchFilters) => void;
  placeholder?: string;
  showAdvancedFilters?: boolean;
}

export interface BlogCategoriesProps extends BlogComponentProps {
  onCategoryClick?: (category: string) => void;
  showPostCount?: boolean;
  maxCategories?: number;
}

export interface BlogTagsProps extends BlogComponentProps {
  onTagClick?: (tag: string) => void;
  showPostCount?: boolean;
  maxTags?: number;
  style?: 'pills' | 'list' | 'cloud';
}

export interface BlogArchiveProps extends BlogComponentProps {
  groupBy?: 'month' | 'year';
  onDateClick?: (date: string) => void;
  showPostCount?: boolean;
}

export interface BlogFeedProps extends BlogComponentProps {
  format?: 'rss' | 'atom' | 'json';
  enableAutoDiscovery?: boolean;
}

export interface BlogFullScreenProps extends BlogComponentProps {
  // Only essential props - everything else comes from backend
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  searchQuery?: string;
  filters?: SearchFilters;
  onPostClick?: (post: BlogPost) => void;
  
  // All styling, layout, and configuration comes from backend
  // No override props allowed - everything is backend-driven
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  maxSize: number;
}

export interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableContentPreloading: boolean;
  cache: CacheConfig;
}

// Error types
export class AutoBlogifyError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AutoBlogifyError';
  }
}

// Event types for analytics
export interface AnalyticsEvent {
  type: 'page_view' | 'post_view' | 'search' | 'filter' | 'share' | 'click';
  data: Record<string, any>;
  timestamp: string;
  sessionId?: string;
  userId?: string;
}

// Hooks return types
export interface UseBlogPostsResult {
  posts: BlogPost[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export interface UseBlogPostResult {
  post: BlogPost | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseBlogMetadataResult {
  metadata: BlogMetadata | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseBlogSearchResult {
  results: BlogPost[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  clearSearch: () => void;
}

// Utility types
export type BlogLayoutType = 'grid' | 'list' | 'masonry' | 'cards';
export type ContentFormat = 'html' | 'markdown' | 'plaintext';
export type ImageSize = 'thumbnail' | 'medium' | 'large' | 'full';

// Plugin system types
export interface PluginConfig {
  name: string;
  version: string;
  enabled: boolean;
  options?: Record<string, any>;
}

export interface Plugin {
  name: string;
  version: string;
  install: (config: PluginConfig) => void;
  uninstall: () => void;
  hooks: {
    beforeRender?: (props: any) => any;
    afterRender?: (element: any) => any;
    beforeApiCall?: (config: any) => any;
    afterApiCall?: (response: any) => any;
  };
}

// Dynamic Design Configuration from Dashboard
export interface BlogDesignConfig {
  theme?: {
    id: string;
    name: string;
    colorScheme: string;
    // Minimal required keys with optional extras
    customColors: {
      primary: string;
      background: string;
      text: string;
      heading: string;
      [key: string]: string;
    };
  };
  layout?: {
    type: 'grid' | 'list' | 'masonry' | 'mosaic';
    columns: number;
    spacing: string;
    maxWidth: string;
    showSidebar: boolean;
    sidebarPosition: 'left' | 'right';
  };
  typography?: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
  };
  components?: {
    blogCard: {
      style: string;
      showImage: boolean;
      showAuthor: boolean;
      showDate: boolean;
      showExcerpt: boolean;
      showReadingTime: boolean;
      showCategories: boolean;
      showTags: boolean;
    };
    blogPost: {
      showAuthor: boolean;
      showDate: boolean;
      showReadingTime: boolean;
      showShareButtons: boolean;
      showRelatedPosts: boolean;
    };
  };
  ctaButtons?: Array<{
    id: string;
    text: string;
    url: string;
    style: string;
    size: string;
    position: string;
    enabled: boolean;
  }>;
  blogSettings?: {
    audioReader?: {
      enabled: boolean;
      voice: 'male' | 'female' | 'auto';
      speed: number;
      autoPlay: boolean;
    };
    sideSection?: {
      enabled: boolean;
      showTableOfContents: boolean;
      showRelatedPosts: boolean;
      showSocialShare: boolean;
      showAuthorBio: boolean;
      showTags: boolean;
      showCategories: boolean;
    };
    readingExperience?: {
      showProgressBar: boolean;
      enableDarkMode: boolean;
      fontSize: 'small' | 'medium' | 'large';
      lineHeight: 'tight' | 'normal' | 'relaxed';
      maxWidth: 'narrow' | 'medium' | 'wide' | 'full';
    };
    seo?: {
      showMetaDescription: boolean;
      showSchemaMarkup: boolean;
      showOpenGraph: boolean;
      showTwitterCards: boolean;
      enableBreadcrumbs: boolean;
    };
    social?: {
      showShareButtons: boolean;
      showSocialProof: boolean;
      showComments: boolean;
      enableNewsletterSignup: boolean;
    };
    branding?: {
      showPoweredBy: boolean;
    };
  };
  customCSS?: string;
  customJS?: string;
}
