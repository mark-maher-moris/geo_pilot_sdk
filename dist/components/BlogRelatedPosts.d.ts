import { GEOPilotConfig, BlogPost } from '../types';
export interface BlogRelatedPostsProps {
    config: GEOPilotConfig;
    postId: string;
    limit?: number;
    onPostClick?: (post: BlogPost) => void;
    className?: string;
}
export declare function BlogRelatedPosts({ config, postId, limit, onPostClick, className }: BlogRelatedPostsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogRelatedPosts.d.ts.map