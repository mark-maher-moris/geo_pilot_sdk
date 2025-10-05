import * as React from 'react';
import { BlogSearchSection } from './components/BlogSearchSection';
import { BlogPostsGrid } from './components/BlogPostsGrid';
import { BlogPaginationSection } from './components/BlogPaginationSection';
import { 
  BlogPost, 
  BlogPagination, 
  BlogLayout, 
  ComponentSettings, 
  BlogState 
} from './types';
import { AutoBlogifyConfig } from '../../types';
import { createDefaultLayout } from './utils/layoutUtils';

interface BlogMainContentProps {
  config: AutoBlogifyConfig;
  design: any; // Keep as any for now since it's used elsewhere
  posts: BlogPost[];
  loading: boolean;
  pagination: BlogPagination;
  layout: string | BlogLayout;
  showSearch: boolean;
  showFilters: boolean;
  showPagination: boolean;
  componentSettings: ComponentSettings;
  blogState: BlogState;
  onPostClick: (post: BlogPost) => void;
}

export const BlogMainContent = React.memo(function BlogMainContent({
  config,
  design,
  posts,
  loading,
  pagination,
  layout,
  showSearch,
  showFilters,
  showPagination,
  componentSettings,
  blogState,
  onPostClick
}: BlogMainContentProps) {
  // Convert string layout to BlogLayout object if needed
  const blogLayout: BlogLayout = React.useMemo(() => {
    if (typeof layout === 'string') {
      return createDefaultLayout(layout as 'grid' | 'list' | 'masonry');
    }
    return layout;
  }, [layout]);

  return (
    <>
      <BlogSearchSection
        config={config}
        blogState={blogState}
        showSearch={showSearch}
        showFilters={showFilters}
      />

      <BlogPostsGrid
        posts={posts}
        loading={loading}
        layout={blogLayout}
        config={config}
        componentSettings={componentSettings}
        blogState={blogState}
        onPostClick={onPostClick}
      />

      <BlogPaginationSection
        pagination={pagination}
        config={config}
        blogState={blogState}
        showPagination={showPagination}
      />
    </>
  );
});
