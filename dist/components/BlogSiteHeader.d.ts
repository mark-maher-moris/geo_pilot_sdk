import * as React from 'react';
export interface BlogSiteHeaderProps {
    websiteName?: string;
    blogHomeUrl?: string;
    mainWebsiteUrl?: string;
    logoUrl?: string;
    navigationItems?: Array<{
        label: string;
        url: string;
    }>;
    className?: string;
    style?: React.CSSProperties;
}
export declare function BlogSiteHeader({ websiteName, blogHomeUrl, mainWebsiteUrl, logoUrl, navigationItems, className, style }: BlogSiteHeaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogSiteHeader.d.ts.map