import React from 'react';
import { BlogTags } from '../BlogTags';

interface BlogSidebarProps {
  config: any;
  metadata: any;
  posts: any[];
  showCategories: boolean;
  showTags: boolean;
  blogState: any;
  onPostClick: (post: any) => void;
}

export const BlogSidebar = React.memo(function BlogSidebar({
  config,
  metadata,
  posts,
  showCategories,
  showTags,
  blogState,
  onPostClick
}: BlogSidebarProps) {
  const handleTagClick = (tag: string) => {
    // Filter posts by tag when a tag is clicked
    blogState.setCurrentSearch?.(tag);
  };

  return (
    <div className="space-y-6">
      {showTags && (
        <div className="blog-sidebar-section">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Tags</h3>
          <BlogTags
            config={config}
            onTagClick={handleTagClick}
            showPostCount={true}
            maxTags={15}
            style="pills"
            className="blog-sidebar-tags"
          />
        </div>
      )}
    </div>
  );
});
