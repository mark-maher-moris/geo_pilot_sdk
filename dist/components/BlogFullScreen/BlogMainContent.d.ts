import * as React from 'react';
import { BlogPost, BlogPagination, BlogLayout, ComponentSettings, BlogState } from './types';
import { GEOPilotConfig } from '../../types';
interface BlogMainContentProps {
    config: GEOPilotConfig;
    design: any;
    posts: BlogPost[];
    loading: boolean;
    pagination: BlogPagination;
    layout: string | BlogLayout;
    showSearch: boolean;
    showFilters: boolean;
    showPagination: boolean;
    componentSettings: ComponentSettings;
    blogState: BlogState;
    onPostClick: (post: BlogPost) => void;
}
export declare const BlogMainContent: React.NamedExoticComponent<BlogMainContentProps>;
export {};
//# sourceMappingURL=BlogMainContent.d.ts.map