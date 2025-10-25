import React from 'react';
export interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    aspectRatio?: number;
    loading?: 'lazy' | 'eager';
    className?: string;
    style?: React.CSSProperties;
    enableResponsive?: boolean;
    sizes?: string;
    enableWebP?: boolean;
    preload?: boolean;
    onLoad?: () => void;
    onError?: () => void;
}
export declare function OptimizedImage({ src, alt, width, height, aspectRatio, loading, className, style, enableResponsive, sizes, enableWebP, preload, onLoad, onError }: OptimizedImageProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=OptimizedImage.d.ts.map