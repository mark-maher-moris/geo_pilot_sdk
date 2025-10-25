import React from 'react';
export interface BlogSocialShareProps {
    url: string;
    title: string;
    description?: string;
    platforms?: ('twitter' | 'facebook' | 'linkedin' | 'email')[];
    position?: 'top' | 'bottom' | 'floating' | 'inline';
    className?: string;
    style?: React.CSSProperties;
}
export declare function BlogSocialShare({ url, title, description, platforms, position, className, style }: BlogSocialShareProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogSocialShare.d.ts.map