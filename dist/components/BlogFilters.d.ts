import { SearchFilters, GEOPilotConfig } from '../types';
export interface BlogFiltersProps {
    config: GEOPilotConfig;
    onFilterChange: (filters: SearchFilters) => void;
    currentFilters?: SearchFilters;
    className?: string;
}
export declare function BlogFilters({ config, onFilterChange, currentFilters, className }: BlogFiltersProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogFilters.d.ts.map