import * as React from 'react';
export interface CTAButton {
    id: string;
    text: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline';
    size: 'sm' | 'md' | 'lg';
}
export interface BlogCTAFooterProps {
    ctaButtons?: CTAButton[];
    footerText?: string;
    showFooter?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export declare function BlogCTAFooter({ ctaButtons, footerText, showFooter, className, style }: BlogCTAFooterProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogCTAFooter.d.ts.map