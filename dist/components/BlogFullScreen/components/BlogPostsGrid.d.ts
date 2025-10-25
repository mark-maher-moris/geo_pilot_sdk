import React from 'react';
import { BlogPost, BlogLayout, ComponentSettings } from '../types';
import { GEOPilotConfig } from '../../../types';
interface BlogPostsGridProps {
    posts: BlogPost[];
    loading: boolean;
    layout: BlogLayout;
    config: GEOPilotConfig;
    componentSettings: ComponentSettings;
    blogState: {
        currentSearch: string;
        currentCategory?: string;
        currentTag?: string;
    };
    onPostClick: (post: BlogPost) => void;
}
export declare const BlogPostsGrid: React.NamedExoticComponent<BlogPostsGridProps>;
export {};
//# sourceMappingURL=BlogPostsGrid.d.ts.map