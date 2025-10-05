import * as React from 'react';
export interface BreadcrumbItem {
    label: string;
    url: string;
    position: number;
}
export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    showHome?: boolean;
    homeLabel?: string;
    homeUrl?: string;
    separator?: string;
    className?: string;
    style?: React.CSSProperties;
    enableStructuredData?: boolean;
}
export declare function Breadcrumbs({ items, showHome, homeLabel, homeUrl, separator, className, style, enableStructuredData }: BreadcrumbsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Breadcrumbs.d.ts.map