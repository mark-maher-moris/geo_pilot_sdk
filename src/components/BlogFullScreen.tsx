import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { BlogFullScreenProps } from '../types';

// Hooks
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useBlogMetadata } from '../hooks/useBlogMetadata';
import { useSEO } from '../hooks/useSEO';
import { useAutoBlogify } from '../hooks/useAutoBlogify';

// Components
import { BlogPost } from './BlogPost';
import { SEOHead } from './SEOHead';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { BlogHeader } from './BlogFullScreen/BlogHeader';
import { BlogMainContent } from './BlogFullScreen/BlogMainContent';
import { BlogSidebar } from './BlogFullScreen/BlogSidebar';
import { BlogFooter } from './BlogFullScreen/BlogFooter';
import { BlogTags } from './BlogTags';

// Utils
import { getLayoutClasses, applyDesignStyles, getComponentSettings } from '../utils/themeUtils';

// Types
interface BlogState {
  selectedPost: any;
  currentPage: number;
  currentSearch?: string;
}

interface BlogStateActions {
  handleSearch: (query: string) => void;
  handlePageChange: (page: number) => void;
  handlePostClick: (post: any) => void;
  handleBackToList: () => void;
  setCurrentSearch: (search?: string) => void;
}

// Custom Hooks
function useBlogState(initialProps: {
  page: number;
  searchQuery?: string;
}): BlogState & BlogStateActions {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(initialProps.page);
  const [currentSearch, setCurrentSearch] = useState(initialProps.searchQuery);

  const handleSearch = useCallback((query: string) => {
    setCurrentSearch(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePostClick = useCallback((post: any) => {
    setSelectedPost(post);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedPost(null);
  }, []);

  return {
    selectedPost,
    currentPage,
    currentSearch,
    handleSearch,
    handlePageChange,
    handlePostClick,
    handleBackToList,
    setCurrentSearch
  };
}

// Helper functions
function createContainerClasses(design: any, className: string): string {
  // Top-level container should not use grid; it should be a centered flex column
  // to avoid unintended left shifts when layout classes are applied to inner grids.
  const baseClasses = 'auto-blogify-blog-full-screen min-h-screen flex flex-col';
  return `${baseClasses} ${className}`.trim();
}

function createContainerStyles(design: any, style?: React.CSSProperties) {
  return applyDesignStyles(design, style);
}

// Main Component
export function BlogFullScreen(props: BlogFullScreenProps) {
  const {
    config,
    page,
    limit,
    searchQuery,
    onPostClick,
    className = '',
    style
  } = props;

  // Hooks
  const { design } = useAutoBlogify();
  const blogState = useBlogState({ page, searchQuery });

  // Get configuration from design - everything comes from backend
  const finalPage = page ?? 1;
  const finalLimit = limit ?? 12;

  const {
    posts,
    pagination,
    loading,
    error,
    refetch
  } = useBlogPosts({
    page: blogState.currentPage,
    limit: finalLimit,
    search: blogState.currentSearch,
    autoFetch: true
  });

  const { metadata, loading: metadataLoading, error: metadataError } = useBlogMetadata();
  const { metaTags, structuredData } = useSEO(config, undefined, 'blog');

  // All configuration comes from backend design
  const componentSettings = useMemo(() => getComponentSettings(design, 'blogCard'), [design]);
  const containerClasses = useMemo(() => createContainerClasses(design, className), [design, className]);
  const containerStyles = useMemo(() => createContainerStyles(design, style), [design, style]);
  
  // Get all settings from backend design configuration
  const finalShowPagination = design?.blogSettings?.readingExperience?.showProgressBar ?? true;
  const finalShowSearch = true; // Always show search by default
  const finalShowFilters = false; // Filters disabled by default
  const finalShowCategories = design?.components?.blogCard?.showCategories ?? false;
  const finalShowTags = design?.components?.blogCard?.showTags ?? true;
  const finalShowSidebar = design?.layout?.showSidebar ?? true;
  const finalShowHeader = true; // Always show header
  const finalShowFooter = true; // Always show footer
  const finalLayout = design?.layout?.type ?? 'grid';
  
  // Blog post configuration from backend design
  const finalWebsiteName = design?.blogSettings?.branding?.showPoweredBy ? "Website's Blog" : undefined;
  const finalBlogHomeUrl = "/";
  const finalMainWebsiteUrl = "/";
  const finalNavigationItems: Array<{label: string; url: string}> = [];
  const finalShowSiteHeader = true;
  const finalShowTOC = design?.blogSettings?.sideSection?.showTableOfContents ?? true;
  const finalShowSocialShare = design?.blogSettings?.sideSection?.showSocialShare ?? true;
  const finalShowConclusionFAQ = true;
  const finalShowCTAFooter = true;
  const finalConclusion = undefined;
  const finalFaqItems: Array<{id: string; question: string; answer: string}> = [];
  const finalFooterText = undefined;
  
  // Get CTA buttons from backend design configuration only
  const finalCTAButtons = useMemo(() => design?.ctaButtons?.filter(btn => btn.enabled) || [], [design]);

  // Event handlers
  const handlePostClick = useCallback((post: any) => {
    if (onPostClick) {
      onPostClick(post);
    } else {
      blogState.handlePostClick(post);
    }
  }, [onPostClick, blogState]);

  // Early returns for loading and error states
  if (loading && !posts.length) {
    return <LoadingState />;
  }

  if (error && !posts.length) {
    return <ErrorState error={error} onRetry={refetch} className={className} style={style} />;
  }

  // Single post view
  if (blogState.selectedPost) {
    return (
      <SinglePostView
        config={config}
        post={blogState.selectedPost}
        onBack={blogState.handleBackToList}
        blogProps={{
          websiteName: finalWebsiteName,
          blogHomeUrl: finalBlogHomeUrl,
          mainWebsiteUrl: finalMainWebsiteUrl,
          logoUrl: undefined,
          navigationItems: finalNavigationItems,
          showSiteHeader: finalShowSiteHeader,
          showTOC: finalShowTOC,
          showSocialShare: finalShowSocialShare,
          showConclusionFAQ: finalShowConclusionFAQ,
          showCTAFooter: finalShowCTAFooter,
          conclusion: finalConclusion,
          faqItems: finalFaqItems,
          ctaButtons: finalCTAButtons,
          footerText: finalFooterText
        }}
        className={className}
        style={style}
      />
    );
  }

  // Main blog list view
  return (
    <BlogListView
      config={config}
      design={design}
      metadata={metadata}
      posts={posts}
      loading={loading}
      pagination={pagination}
      blogState={blogState}
      showProps={{
        showHeader: finalShowHeader,
        showFooter: finalShowFooter,
        showSidebar: finalShowSidebar,
        showSearch: finalShowSearch,
        showFilters: finalShowFilters,
        showPagination: finalShowPagination,
        showCategories: finalShowCategories,
        showTags: finalShowTags
      }}
      layoutProps={{
        layout: finalLayout,
        containerClasses,
        containerStyles,
        componentSettings
      }}
      onPostClick={handlePostClick}
    />
  );
}

// Sub-components
function LoadingState() {
  return (
    <div className="auto-blogify-blog-full-screen-loading flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
}

function ErrorState({ error, onRetry, className, style }: {
  error: string;
  onRetry: () => void;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <ErrorMessage 
      message={error} 
      onRetry={onRetry}
      className={className}
      style={style}
    />
  );
}

function SinglePostView({ 
  config, 
  post, 
  onBack, 
  blogProps, 
  className, 
  style 
}: {
  config: any;
  post: any;
  onBack: () => void;
  blogProps: any;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <BlogPost
      config={config}
      postId={post.id}
      slug={post.slug}
      onBack={onBack}
      showRelatedPosts={true}
      enableComments={false}
      enableSharing={blogProps.showSocialShare}
      {...blogProps}
      className={className}
      style={style}
    />
  );
}

function BlogListView({
  config,
  design,
  metadata,
  posts,
  loading,
  pagination,
  blogState,
  showProps,
  layoutProps,
  onPostClick
}: {
  config: any;
  design: any;
  metadata: any;
  posts: any[];
  loading: boolean;
  pagination: any;
  blogState: BlogState & BlogStateActions;
  showProps: any;
  layoutProps: any;
  onPostClick: (post: any) => void;
}) {
  const {
    showHeader,
    showFooter,
    showSidebar,
    showSearch,
    showFilters,
    showPagination,
    showCategories,
    showTags
  } = showProps;

  const {
    layout,
    containerClasses,
    containerStyles,
    componentSettings
  } = layoutProps;

  return (
    <div 
      className={containerClasses}
      style={containerStyles}
      role="main"
      aria-label="Blog content"
    >
      <SEOHead 
        config={config}
        title={metadata?.seoTitle || metadata?.projectName || 'Blog'}
        description={metadata?.seoDescription || metadata?.description}
      />

      {showHeader && (
        <BlogHeader
          config={config}
          design={design}
          metadata={metadata}
        />
      )}

      <main className="flex-1 w-full" role="main" aria-label="Blog posts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className={`flex gap-8 ${showSidebar ? 'lg:flex-row' : 'flex-col justify-center'}`}>
            
            <MainContentSection
              config={config}
              design={design}
              posts={posts}
              loading={loading}
              pagination={pagination}
              layout={layout}
              showSearch={showSearch}
              showFilters={showFilters}
              showPagination={showPagination}
              showSidebar={showSidebar}
              componentSettings={componentSettings}
              blogState={blogState}
              onPostClick={onPostClick}
            />

            {showSidebar && (
              <SidebarSection
                config={config}
                metadata={metadata}
                posts={posts}
                showCategories={showCategories}
                showTags={showTags}
                blogState={blogState}
                onPostClick={onPostClick}
              />
            )}
          </div>
        </div>
      </main>

      {showFooter && <BlogFooter metadata={metadata} showPoweredBy={design?.blogSettings?.branding?.showPoweredBy ?? true} />}
    </div>
  );
}

function MainContentSection({
  config,
  design,
  posts,
  loading,
  pagination,
  layout,
  showSearch,
  showFilters,
  showPagination,
  showSidebar,
  componentSettings,
  blogState,
  onPostClick
}: any) {
  return (
    <div 
      className={`${showSidebar ? 'lg:w-2/3' : 'w-full max-w-5xl mx-auto'}`}
      role="region"
      aria-label="Blog posts and filters"
    >
      <BlogMainContent
        config={config}
        design={design}
        posts={posts}
        loading={loading}
        pagination={pagination}
        layout={layout}
        showSearch={showSearch}
        showFilters={showFilters}
        showPagination={showPagination}
        componentSettings={componentSettings}
        blogState={blogState}
        onPostClick={onPostClick}
      />

    </div>
  );
}

function SidebarSection({
  config,
  metadata,
  posts,
  showCategories,
  showTags,
  blogState,
  onPostClick
}: any) {
  return (
    <aside 
      className="lg:w-1/3"
      role="complementary"
      aria-label="Blog sidebar"
    >
      <BlogSidebar
        config={config}
        metadata={metadata}
        posts={posts}
        showCategories={showCategories}
        showTags={showTags}
        blogState={blogState}
        onPostClick={onPostClick}
      />
    </aside>
  );
}