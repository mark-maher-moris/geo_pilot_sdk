import { BlogLayout } from '../types';

export const getLayoutClasses = (layout: BlogLayout): string => {
  const { type, columns } = layout;
  
  const baseClasses = 'grid gap-6';
  
  switch (type) {
    case 'grid':
      return `${baseClasses} grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;
    
    case 'list':
      return `${baseClasses} grid-cols-1`;
    
    case 'masonry':
      return `${baseClasses} grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;
    
    default:
      return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
  }
};

export const createDefaultLayout = (type: 'grid' | 'list' | 'masonry' = 'grid'): BlogLayout => ({
  type,
  columns: {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }
});

export const getEmptyStateMessage = (
  hasSearch: boolean,
  hasCategory: boolean,
  hasTag: boolean
): string => {
  if (hasSearch || hasCategory || hasTag) {
    return 'Try adjusting your search or filters';
  }
  return 'No blog posts have been published yet';
};
