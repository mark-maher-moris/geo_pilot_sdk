export type { BlogPost, Pagination as BlogPagination } from '../../types';
export interface BlogFilters {
    category?: string;
    tag?: string;
    search?: string;
    dateRange?: {
        start: string;
        end: string;
    };
}
export interface BlogLayout {
    type: 'grid' | 'list' | 'masonry';
    columns: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
}
export interface BlogConfig {
    theme: string;
    colors: Record<string, string>;
    fonts: Record<string, string>;
    spacing: Record<string, string>;
}
export interface ComponentSettings {
    showAuthor: boolean;
    showDate: boolean;
    showReadingTime: boolean;
    showCategories: boolean;
    showTags: boolean;
    showExcerpt: boolean;
    showFeaturedImage: boolean;
    showShareButtons: boolean;
    showRelatedPosts: boolean;
}
export interface BlogState {
    currentSearch: string;
    currentCategory?: string;
    currentTag?: string;
    currentFilters: BlogFilters;
    handleSearch: (query: string) => void;
    handleFilterChange: (filters: BlogFilters) => void;
    handlePageChange: (page: number) => void;
    setCurrentCategory: (category?: string) => void;
    setCurrentTag: (tag?: string) => void;
    setCurrentSearch: (search: string) => void;
}
//# sourceMappingURL=types.d.ts.map