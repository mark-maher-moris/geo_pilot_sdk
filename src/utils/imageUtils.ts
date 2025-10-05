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
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string {
  return widths
    .map(width => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Generate responsive sizes attribute
 */
export function generateSizes(breakpoints: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  large?: string;
} = {}): string {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw',
    large = '25vw'
  } = breakpoints;

  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, (max-width: 1280px) ${desktop}, ${large}`;
}

/**
 * Calculate aspect ratio from dimensions
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Generate optimized image configuration
 */
export function createOptimizedImageConfig(
  src: string,
  alt: string,
  options: {
    width?: number;
    height?: number;
    aspectRatio?: number;
    loading?: 'lazy' | 'eager';
    className?: string;
    style?: React.CSSProperties;
    enableResponsive?: boolean;
    sizes?: string;
  } = {}
): ResponsiveImageConfig {
  const {
    width = 400,
    height = 300,
    aspectRatio,
    loading = 'lazy',
    className = '',
    style = {},
    enableResponsive = true,
    sizes
  } = options;

  // Calculate height from aspect ratio if provided
  const finalHeight = aspectRatio ? Math.round(width / aspectRatio) : height;

  const config: ResponsiveImageConfig = {
    src,
    alt,
    width,
    height: finalHeight,
    loading,
    className,
    style
  };

  // Add responsive features if enabled
  if (enableResponsive) {
    config.srcSet = generateSrcSet(src);
    config.sizes = sizes || generateSizes();
  }

  return config;
}

/**
 * Preload critical images for better performance
 */
export function preloadImage(src: string, as: 'image' = 'image'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = src;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Generate WebP srcset for better compression
 */
export function generateWebPSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string {
  return widths
    .map(width => `${baseUrl}?w=${width}&format=webp ${width}w`)
    .join(', ');
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Get optimal image format based on browser support
 */
export async function getOptimalImageFormat(
  baseUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): Promise<{ srcSet: string; fallbackSrc: string }> {
  const supportsWebPFormat = await supportsWebP();
  
  if (supportsWebPFormat) {
    return {
      srcSet: generateWebPSrcSet(baseUrl, widths),
      fallbackSrc: baseUrl
    };
  }

  return {
    srcSet: generateSrcSet(baseUrl, widths),
    fallbackSrc: baseUrl
  };
}
