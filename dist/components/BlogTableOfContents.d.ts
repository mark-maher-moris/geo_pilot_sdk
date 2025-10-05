import * as React from 'react';
export interface TableOfContentsItem {
    id: string;
    title: string;
    level: number;
    children?: TableOfContentsItem[];
}
export interface BlogTableOfContentsProps {
    items: TableOfContentsItem[];
    isSticky?: boolean;
    position?: 'left' | 'right' | 'sidebar';
    className?: string;
    style?: React.CSSProperties;
}
export declare function BlogTableOfContents({ items, isSticky, position, className, style }: BlogTableOfContentsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogTableOfContents.d.ts.map