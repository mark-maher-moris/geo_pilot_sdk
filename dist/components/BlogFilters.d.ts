import { SearchFilters, AutoBlogifyConfig } from '../types';
export interface BlogFiltersProps {
    config: AutoBlogifyConfig;
    onFilterChange: (filters: SearchFilters) => void;
    currentFilters?: SearchFilters;
    className?: string;
}
export declare function BlogFilters({ config, onFilterChange, currentFilters, className }: BlogFiltersProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogFilters.d.ts.map