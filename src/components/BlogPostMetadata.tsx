import * as React from 'react';
import { useMemo } from 'react';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { applyDesignStyles, applyHeadingFontStyles, getHeadingFontFamilyCSS } from '../utils/themeUtils';
import { formatDate } from '../utils/formatters';
import { OptimizedImage } from './OptimizedImage';
import { ContentFreshness } from './ContentFreshness';

export interface BlogPostMetadataProps {
  title: string;
  coverImage?: string;
  publishDate?: string | Date;
  updatedDate?: string | Date;
  author?: string;
  readingTime?: number;
  showContentFreshness?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function BlogPostMetadata({
  title,
  coverImage,
  publishDate,
  updatedDate,
  author,
  readingTime,
  showContentFreshness = false,
  className = '',
  style
}: BlogPostMetadataProps) {
  const { design } = useGEOPilot();

  const containerClasses = useMemo(() => {
    return `
      auto-blogify-post-metadata
      max-w-4xl
      mx-auto
      px-4
      py-8
      ${className}
    `.trim().replace(/\s+/g, ' ');
  }, [className]);

  const containerStyles = useMemo(() => {
    return applyDesignStyles(design, style);
  }, [design, style]);

  const formattedDate = useMemo(() => {
    if (!publishDate) return null;
    return formatDate(publishDate instanceof Date ? publishDate.toISOString() : publishDate);
  }, [publishDate]);

  return (
    <div className={containerClasses} style={containerStyles}>
      {/* Cover Image */}
      {coverImage && (
        <div className="mb-8">
          <OptimizedImage
            src={coverImage}
            alt={title}
            width={800}
            height={600}
            aspectRatio={4/3}
            loading="eager"
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            enableResponsive={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
            preload={true}
          />
        </div>
      )}

      {/* Title */}
      <header className="mb-6">
        <h1 
          className="text-4xl md:text-5xl font-bold leading-tight mb-6"
          style={{ 
            ...applyHeadingFontStyles(design),
            color: design?.theme?.customColors?.primary || '#111827'
          }}
        >
          {title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {formattedDate && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate}</span>
            </div>
          )}
          
          {author && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>By {author}</span>
            </div>
          )}
          
          {readingTime && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readingTime} min read</span>
            </div>
          )}
        </div>

        {/* Content Freshness */}
        {showContentFreshness && publishDate && (
          <div className="mt-4">
            <ContentFreshness
              publishedAt={publishDate instanceof Date ? publishDate.toISOString() : publishDate}
              updatedAt={updatedDate ? (updatedDate instanceof Date ? updatedDate.toISOString() : updatedDate) : undefined}
              showIndicator={true}
              showLastUpdated={true}
              freshnessThreshold={30}
            />
          </div>
        )}
      </header>
    </div>
  );
}
