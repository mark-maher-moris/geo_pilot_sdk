import * as React from 'react';
import { useMemo } from 'react';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useSEO } from '../hooks/useSEO';
import { useAutoBlogify } from '../hooks/useAutoBlogify';
import { BlogListProps } from '../types';
import { BlogCard } from './BlogCard';
import { BlogPagination } from './BlogPagination';
import { BlogSearch } from './BlogSearch';
import { BlogFilters } from './BlogFilters';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { SEOHead } from './SEOHead';
import { getLayoutClasses, applyDesignStyles, getComponentSettings } from '../utils/themeUtils';

export function BlogList({
  config,
  page = 1,
  limit = 10,
  category,
  tag,
  searchQuery,
  filters,
  onPostClick,
  showPagination = true,
  showSearch = true,
  showFilters = false,
  className = '',
  style
}: BlogListProps) {
  const { design } = useAutoBlogify();
  
  const {
    posts,
    pagination,
    loading,
    error,
    refetch
  } = useBlogPosts({
    page,
    limit,
    category,
    tag,
    search: searchQuery,
    filters,
    autoFetch: true
  });

  const { metaTags, structuredData } = useSEO(config, undefined, 'blog');

  // Get component settings from design configuration
  const componentSettings = getComponentSettings(design, 'blogCard');

  const containerClasses = useMemo(() => {
    const baseClasses = 'auto-blogify-blog-list';
    const layoutClasses = getLayoutClasses(design);
    
    return `${baseClasses} ${layoutClasses} ${className}`.trim();
  }, [design, className]);

  const containerStyles = useMemo(() => {
    return applyDesignStyles(design, style);
  }, [design, style]);

  const handlePostClick = (post: any) => {
    if (onPostClick) {
      onPostClick(post);
    }
  };

  const handleSearch = (query: string) => {
    // This would typically update the URL or parent component state
    // For now, we'll just trigger a refetch
    refetch();
  };

  const handleFilterChange = (newFilters: any) => {
    // This would typically update the URL or parent component state
    // For now, we'll just trigger a refetch
    refetch();
  };

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={refetch}
        className={className}
        style={style}
      />
    );
  }

  return (
    <>
      {/* SEO Head */}
      <SEOHead 
        config={config} 
        metaTags={metaTags}
        structuredData={structuredData}
        enableAdvancedSEO={true}
        type="website"
      />
      
      <div 
        className={`auto-blogify-blog-list-container ${className}`}
        style={containerStyles}
      >
        {/* Custom CSS */}
        {(config.theme?.customCSS || design?.customCSS) && (
          <style dangerouslySetInnerHTML={{ __html: config.theme?.customCSS || design?.customCSS || '' }} />
        )}

      {/* Search */}
      {showSearch && (
        <div className="auto-blogify-search-container mb-6">
          <BlogSearch
            config={config}
            onSearch={handleSearch}
            placeholder="Search blog posts..."
            showAdvancedFilters={showFilters}
          />
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="auto-blogify-filters-container mb-6">
          <BlogFilters
            config={config}
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="auto-blogify-loading-container">
          <LoadingSpinner />
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="auto-blogify-empty-state text-center py-12">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No blog posts found
          </h3>
          <p className="text-gray-500">
            {searchQuery || category || tag
              ? 'Try adjusting your search criteria'
              : 'Check back later for new content'
            }
          </p>
        </div>
      )}

      {/* Blog Posts */}
      {!loading && posts.length > 0 && (
        <>
          <div className={containerClasses}>
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                config={config}
                onClick={() => handlePostClick(post)}
                showAuthor={componentSettings.showAuthor}
                showDate={componentSettings.showDate}
                showReadingTime={componentSettings.showReadingTime}
                showCategories={componentSettings.showCategories}
                showTags={componentSettings.showTags}
                showExcerpt={componentSettings.showExcerpt}
                showFeaturedImage={componentSettings.showFeaturedImage}
              />
            ))}
          </div>

          {/* Pagination */}
          {showPagination && pagination.pages > 1 && (
            <div className="auto-blogify-pagination-container mt-8">
              <BlogPagination
                config={config}
                pagination={pagination}
                onPageChange={(newPage) => {
                  // This would typically update the URL or parent component state
                  // The useBlogPosts hook would react to the page prop change
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
}
