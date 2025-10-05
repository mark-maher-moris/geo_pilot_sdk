/**
 * Performance optimization utilities for Core Web Vitals
 */
/**
 * Preload critical resources for better performance
 */
export declare function preloadResource(href: string, as?: 'image' | 'script' | 'style' | 'font' | 'fetch', crossorigin?: boolean): void;
/**
 * Preconnect to external domains
 */
export declare function preconnectToDomain(domain: string): void;
/**
 * DNS prefetch for external domains
 */
export declare function dnsPrefetch(domain: string): void;
/**
 * Optimize images for Core Web Vitals
 */
export declare function optimizeImageForCWV(src: string, options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
}): string;
/**
 * Lazy load images with Intersection Observer
 */
export declare function setupLazyLoading(selector?: string, options?: IntersectionObserverInit): void;
/**
 * Optimize fonts for better performance
 */
export declare function optimizeFonts(fonts: Array<{
    family: string;
    weight?: string | number;
    style?: string;
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}>): void;
/**
 * Measure Core Web Vitals
 */
export declare function measureCoreWebVitals(onMetric: (metric: any) => void): void;
/**
 * Optimize third-party scripts
 */
export declare function optimizeThirdPartyScripts(): void;
/**
 * Optimize critical CSS
 */
export declare function inlineCriticalCSS(css: string): void;
/**
 * Defer non-critical JavaScript
 */
export declare function deferNonCriticalJS(scriptSrc: string): void;
/**
 * Optimize for mobile performance
 */
export declare function optimizeForMobile(): void;
/**
 * Initialize all performance optimizations
 */
export declare function initializePerformanceOptimizations(config?: {
    enableLazyLoading?: boolean;
    enableThirdPartyOptimization?: boolean;
    enableMobileOptimization?: boolean;
    enableCoreWebVitals?: boolean;
    customDomains?: string[];
}): void;
//# sourceMappingURL=performanceUtils.d.ts.map