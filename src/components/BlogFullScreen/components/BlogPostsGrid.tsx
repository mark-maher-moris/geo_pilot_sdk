import * as React from 'react';
import { BlogCard } from '../../BlogCard';
import { LoadingSpinner } from '../../LoadingSpinner';
import { BlogPost, BlogLayout, ComponentSettings } from '../types';
import { GEOPilotConfig } from '../../../types';
import { getLayoutClasses, getEmptyStateMessage } from '../utils/layoutUtils';

interface BlogPostsGridProps {
  posts: BlogPost[];
  loading: boolean;
  layout: BlogLayout;
  config: GEOPilotConfig;
  componentSettings: ComponentSettings;
  blogState: {
    currentSearch: string;
    currentCategory?: string;
    currentTag?: string;
  };
  onPostClick: (post: BlogPost) => void;
}

export const BlogPostsGrid = React.memo(function BlogPostsGrid({
  posts,
  loading,
  layout,
  config,
  componentSettings,
  blogState,
  onPostClick
}: BlogPostsGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (posts.length === 0) {
    const message = getEmptyStateMessage(
      !!blogState.currentSearch,
      !!blogState.currentCategory,
      !!blogState.currentTag
    );

    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No posts found</div>
        <p className="text-gray-400">{message}</p>
      </div>
    );
  }

  const gridClasses = getLayoutClasses(layout);

  return (
    <div className={gridClasses}>
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          config={config}
          onClick={() => onPostClick(post)}
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
  );
});
