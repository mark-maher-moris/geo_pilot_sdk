/**
 * Performance optimization utilities for Core Web Vitals
 */

/**
 * Preload critical resources for better performance
 */
export function preloadResource(
  href: string,
  as: 'image' | 'script' | 'style' | 'font' | 'fetch' = 'image',
  crossorigin?: boolean
): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (crossorigin) {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
}

/**
 * Preconnect to external domains
 */
export function preconnectToDomain(domain: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  document.head.appendChild(link);
}

/**
 * DNS prefetch for external domains
 */
export function dnsPrefetch(domain: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
}

/**
 * Optimize images for Core Web Vitals
 */
export function optimizeImageForCWV(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}
): string {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // If it's already an optimized URL, return as is
  if (src.includes('?') || src.includes('&')) {
    return src;
  }
  
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality) params.set('q', quality.toString());
  if (format) params.set('f', format);
  
  return `${src}?${params.toString()}`;
}

/**
 * Lazy load images with Intersection Observer
 */
export function setupLazyLoading(
  selector: string = 'img[data-src]',
  options: IntersectionObserverInit = {}
): void {
  if (typeof window === 'undefined') return;

  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px 0px',
    threshold: 0.01,
    ...options
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  }, defaultOptions);

  // Observe all lazy images
  document.querySelectorAll(selector).forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Optimize fonts for better performance
 */
export function optimizeFonts(fonts: Array<{
  family: string;
  weight?: string | number;
  style?: string;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}>): void {
  if (typeof window === 'undefined') return;

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    
    // Build font URL (this would need to be customized based on your font provider)
    const fontUrl = `https://fonts.googleapis.com/css2?family=${font.family.replace(/\s+/g, '+')}:wght@${font.weight || '400'}&display=${font.display || 'swap'}`;
    link.href = fontUrl;
    
    document.head.appendChild(link);
  });
}

/**
 * Measure Core Web Vitals
 */
export function measureCoreWebVitals(
  onMetric: (metric: any) => void
): void {
  if (typeof window === 'undefined') return;

  // Import web-vitals library dynamically
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(onMetric);
    getFID(onMetric);
    getFCP(onMetric);
    getLCP(onMetric);
    getTTFB(onMetric);
  }).catch(() => {
    // Fallback if web-vitals is not available
    console.warn('web-vitals library not available');
  });
}

/**
 * Optimize third-party scripts
 */
export function optimizeThirdPartyScripts(): void {
  if (typeof window === 'undefined') return;

  // Add resource hints for common third-party services
  const thirdPartyDomains = [
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google.com',
    'https://www.gstatic.com'
  ];

  thirdPartyDomains.forEach(domain => {
    dnsPrefetch(domain);
  });
}

/**
 * Optimize critical CSS
 */
export function inlineCriticalCSS(css: string): void {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.insertBefore(style, document.head.firstChild);
}

/**
 * Defer non-critical JavaScript
 */
export function deferNonCriticalJS(scriptSrc: string): void {
  if (typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.src = scriptSrc;
  script.defer = true;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Optimize for mobile performance
 */
export function optimizeForMobile(): void {
  if (typeof window === 'undefined') return;

  // Add viewport meta tag if not present
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
    document.head.appendChild(viewport);
  }

  // Add theme-color meta tag
  if (!document.querySelector('meta[name="theme-color"]')) {
    const themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#ffffff';
    document.head.appendChild(themeColor);
  }

  // Optimize touch interactions
  document.body.style.touchAction = 'manipulation';
}

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations(config: {
  enableLazyLoading?: boolean;
  enableThirdPartyOptimization?: boolean;
  enableMobileOptimization?: boolean;
  enableCoreWebVitals?: boolean;
  customDomains?: string[];
} = {}): void {
  const {
    enableLazyLoading = true,
    enableThirdPartyOptimization = true,
    enableMobileOptimization = true,
    enableCoreWebVitals = true,
    customDomains = []
  } = config;

  if (enableLazyLoading) {
    setupLazyLoading();
  }

  if (enableThirdPartyOptimization) {
    optimizeThirdPartyScripts();
  }

  if (enableMobileOptimization) {
    optimizeForMobile();
  }

  if (enableCoreWebVitals) {
    measureCoreWebVitals((metric) => {
      console.log('Core Web Vital:', metric);
      // Here you could send metrics to your analytics service
    });
  }

  // Preconnect to custom domains
  customDomains.forEach(domain => {
    preconnectToDomain(domain);
  });
}
