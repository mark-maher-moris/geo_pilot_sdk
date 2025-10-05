import * as React from 'react';
export interface BlogPostMetadataProps {
    title: string;
    coverImage?: string;
    publishDate?: string | Date;
    updatedDate?: string | Date;
    author?: string;
    readingTime?: number;
    showContentFreshness?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export declare function BlogPostMetadata({ title, coverImage, publishDate, updatedDate, author, readingTime, showContentFreshness, className, style }: BlogPostMetadataProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogPostMetadata.d.ts.map