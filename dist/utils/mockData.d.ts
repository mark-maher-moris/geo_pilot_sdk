import { BlogPost, BlogMetadata, Pagination } from '../types';
export declare const mockBlogPosts: BlogPost[];
export declare const mockBlogMetadata: BlogMetadata;
export declare const mockCategories: string[];
export declare const mockTags: string[];
export declare function generateMockPagination(page: number, limit: number, total: number): Pagination;
export declare function generateMockBlogPostsResponse(page?: number, limit?: number, search?: string, category?: string, tag?: string): {
    posts: BlogPost[];
    pagination: Pagination;
};
export declare function generateMockMetadataResponse(): {
    metadata: BlogMetadata;
};
export declare function generateMockCategoriesResponse(): {
    categories: string[];
};
export declare function generateMockTagsResponse(): {
    tags: string[];
};
//# sourceMappingURL=mockData.d.ts.map