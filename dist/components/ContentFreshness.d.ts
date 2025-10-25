import React from 'react';
export interface ContentFreshnessProps {
    publishedAt: string;
    updatedAt?: string;
    showIndicator?: boolean;
    showLastUpdated?: boolean;
    freshnessThreshold?: number;
    className?: string;
    style?: React.CSSProperties;
}
export declare function ContentFreshness({ publishedAt, updatedAt, showIndicator, showLastUpdated, freshnessThreshold, // 30 days
className, style }: ContentFreshnessProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ContentFreshness.d.ts.map