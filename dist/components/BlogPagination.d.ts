import { Pagination, AutoBlogifyConfig } from '../types';
export interface BlogPaginationProps {
    pagination: Pagination;
    config: AutoBlogifyConfig;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
    maxPages?: number;
    className?: string;
}
export declare function BlogPagination({ pagination, config, onPageChange, showFirstLast, showPrevNext, maxPages, className }: BlogPaginationProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogPagination.d.ts.map