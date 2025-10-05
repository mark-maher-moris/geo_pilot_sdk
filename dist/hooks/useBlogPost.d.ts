import { UseBlogPostResult } from '../types';
export interface UseBlogPostOptions {
    postId?: string;
    slug?: string;
    autoFetch?: boolean;
    trackView?: boolean;
}
export declare function useBlogPost(options?: UseBlogPostOptions): UseBlogPostResult;
//# sourceMappingURL=useBlogPost.d.ts.map