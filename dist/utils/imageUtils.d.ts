/**
 * Image optimization utilities for SEO and performance
 */
export interface ImageDimensions {
    width: number;
    height: number;
}
export interface ResponsiveImageConfig {
    src: string;
    alt: string;
    width: number;
    height: number;
    sizes?: string;
    srcSet?: string;
    loading?: 'lazy' | 'eager';
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Generate responsive image srcset for different screen sizes
 */
export declare function generateSrcSet(baseUrl: string, widths?: number[]): string;
/**
 * Generate responsive sizes attribute
 */
export declare function generateSizes(breakpoints?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
}): string;
/**
 * Calculate aspect ratio from dimensions
 */
export declare function calculateAspectRatio(width: number, height: number): number;
/**
 * Generate optimized image configuration
 */
export declare function createOptimizedImageConfig(src: string, alt: string, options?: {
    width?: number;
    height?: number;
    aspectRatio?: number;
    loading?: 'lazy' | 'eager';
    className?: string;
    style?: React.CSSProperties;
    enableResponsive?: boolean;
    sizes?: string;
}): ResponsiveImageConfig;
/**
 * Preload critical images for better performance
 */
export declare function preloadImage(src: string, as?: 'image'): void;
/**
 * Generate WebP srcset for better compression
 */
export declare function generateWebPSrcSet(baseUrl: string, widths?: number[]): string;
/**
 * Check if browser supports WebP
 */
export declare function supportsWebP(): Promise<boolean>;
/**
 * Get optimal image format based on browser support
 */
export declare function getOptimalImageFormat(baseUrl: string, widths?: number[]): Promise<{
    srcSet: string;
    fallbackSrc: string;
}>;
//# sourceMappingURL=imageUtils.d.ts.map