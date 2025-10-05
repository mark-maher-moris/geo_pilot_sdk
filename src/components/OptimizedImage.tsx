import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  ResponsiveImageConfig, 
  createOptimizedImageConfig, 
  getOptimalImageFormat,
  preloadImage 
} from '../utils/imageUtils';

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

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  aspectRatio,
  loading = 'lazy',
  className = '',
  style = {},
  enableResponsive = true,
  sizes,
  enableWebP = true,
  preload = false,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageConfig, setImageConfig] = useState<ResponsiveImageConfig | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const setupImage = async () => {
      try {
        let config: ResponsiveImageConfig;

        if (enableWebP && enableResponsive) {
          const { srcSet, fallbackSrc } = await getOptimalImageFormat(src);
          config = createOptimizedImageConfig(fallbackSrc, alt, {
            width,
            height,
            aspectRatio,
            loading,
            className,
            style,
            enableResponsive,
            sizes
          });
          config.srcSet = srcSet;
        } else {
          config = createOptimizedImageConfig(src, alt, {
            width,
            height,
            aspectRatio,
            loading,
            className,
            style,
            enableResponsive,
            sizes
          });
        }

        setImageConfig(config);

        // Preload if requested
        if (preload && loading === 'eager') {
          preloadImage(src);
        }
      } catch (error) {
        console.error('Error setting up optimized image:', error);
        // Fallback to basic config
        setImageConfig(createOptimizedImageConfig(src, alt, {
          width,
          height,
          aspectRatio,
          loading,
          className,
          style,
          enableResponsive: false
        }));
      }
    };

    setupImage();
  }, [src, alt, width, height, aspectRatio, loading, className, style, enableResponsive, sizes, enableWebP, preload]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (!imageConfig) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
          ...style 
        }}
        aria-label="Loading image"
      />
    );
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
          ...style 
        }}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imageConfig.src}
      alt={imageConfig.alt}
      width={imageConfig.width}
      height={imageConfig.height}
      srcSet={imageConfig.srcSet}
      sizes={imageConfig.sizes}
      loading={imageConfig.loading}
      className={`${imageConfig.className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      style={imageConfig.style}
      onLoad={handleLoad}
      onError={handleError}
      decoding="async"
    />
  );
}
