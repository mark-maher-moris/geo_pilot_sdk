import * as React from 'react';
import { BlogSearch } from '../../BlogSearch';
import { BlogState } from '../types';
import { AutoBlogifyConfig } from '../../../types';

interface BlogSearchSectionProps {
  config: AutoBlogifyConfig;
  blogState: BlogState;
  showSearch: boolean;
  showFilters: boolean;
}

export const BlogSearchSection = React.memo(function BlogSearchSection({
  config,
  blogState,
  showSearch,
  showFilters
}: BlogSearchSectionProps) {
  if (!showSearch) {
    return null;
  }

  return (
    <div className="mb-8">
      {showSearch && (
        <BlogSearch 
          config={config}
          onSearch={blogState.handleSearch}
          placeholder="Search blog posts..."
          showAdvancedFilters={false}
        />
      )}
    </div>
  );
});
