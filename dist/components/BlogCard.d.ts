import React from 'react';
import { BlogPost, GEOPilotConfig } from '../types';
export interface BlogCardProps {
    post: BlogPost;
    config: GEOPilotConfig;
    onClick?: () => void;
    showAuthor?: boolean;
    showDate?: boolean;
    showReadingTime?: boolean;
    showCategories?: boolean;
    showTags?: boolean;
    showExcerpt?: boolean;
    showFeaturedImage?: boolean;
    showContentFreshness?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export declare function BlogCard({ post, config, onClick, showAuthor, showDate, showReadingTime, showCategories, showTags, showExcerpt, showFeaturedImage, showContentFreshness, className, style }: BlogCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogCard.d.ts.map