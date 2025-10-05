import { UseBlogPostsResult, SearchFilters } from '../types';
export interface UseBlogPostsOptions {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    filters?: SearchFilters;
    autoFetch?: boolean;
    enableInfiniteScroll?: boolean;
}
export declare function useBlogPosts(options?: UseBlogPostsOptions): UseBlogPostsResult;
//# sourceMappingURL=useBlogPosts.d.ts.map