import * as React from 'react';
import { BlogPagination } from '../../BlogPagination';
import { BlogPagination as PaginationType, BlogState } from '../types';
import { AutoBlogifyConfig } from '../../../types';

interface BlogPaginationSectionProps {
  pagination: PaginationType;
  config: AutoBlogifyConfig;
  blogState: BlogState;
  showPagination: boolean;
}

export const BlogPaginationSection = React.memo(function BlogPaginationSection({
  pagination,
  config,
  blogState,
  showPagination
}: BlogPaginationSectionProps) {
  if (!showPagination || pagination.pages <= 1) {
    return null;
  }

  return (
    <div className="mt-12">
      <BlogPagination 
        config={config}
        pagination={pagination}
        onPageChange={blogState.handlePageChange}
      />
    </div>
  );
});
