import * as React from 'react';
import { useMemo } from 'react';
import { BlogPost, GEOPilotConfig } from '../types';
import { formatDate, formatReadingTime } from '../utils/formatters';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { applyDesignStyles, getComponentSettings } from '../utils/themeUtils';
import { OptimizedImage } from './OptimizedImage';
import { ContentFreshness } from './ContentFreshness';

export interface BlogCardProps {
  post: BlogPost;
  config: GEOPilotConfig;
  onClick?: () => void;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showExcerpt?: boolean;
  showFeaturedImage?: boolean;
  showContentFreshness?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function BlogCard({
  post,
  config,
  onClick,
  showAuthor = true,
  showDate = true,
  showReadingTime = true,
  showCategories = true,
  showTags = false,
  showExcerpt = true,
  showFeaturedImage = true,
  showContentFreshness = false,
  className = '',
  style
}: BlogCardProps) {
  const { design } = useGEOPilot();
  
  // Get component settings from design configuration
  const componentSettings = getComponentSettings(design, 'blogCard');
  
  const cardClasses = useMemo(() => {
    return `
      auto-blogify-blog-card
      bg-white
      rounded-lg
      shadow-md
      overflow-hidden
      transition-all
      duration-300
      hover:shadow-lg
      hover:transform
      hover:-translate-y-1
      cursor-pointer
      ${className}
    `.trim().replace(/\s+/g, ' ');
  }, [className]);

  const cardStyles = useMemo(() => {
    return applyDesignStyles(design, style);
  }, [design, style]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const excerpt = useMemo(() => {
    if (!showExcerpt) return '';
    
    if (post.excerpt) {
      return post.excerpt;
    }
    
    // Generate excerpt from content
    const strippedContent = post.content.replace(/<[^>]*>/g, '');
    return strippedContent.length > 150 
      ? strippedContent.substring(0, 150) + '...'
      : strippedContent;
  }, [post.excerpt, post.content, showExcerpt]);

  return (
    <article 
      className={cardClasses}
      onClick={handleClick}
      style={cardStyles}
    >
      {/* Featured Image */}
      {showFeaturedImage && componentSettings.showFeaturedImage && post.featuredImage && (
        <div className="auto-blogify-featured-image-container">
          <OptimizedImage
            src={post.featuredImage}
            alt={post.title}
            width={400}
            height={300}
            aspectRatio={4/3}
            loading="lazy"
            className="w-full h-48 object-cover"
            enableResponsive={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        {showCategories && componentSettings.showCategories && post.categories && post.categories.length > 0 && (
          <div className="auto-blogify-categories mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mr-2 mb-1"
                style={{ 
                  backgroundColor: design?.theme?.customColors?.primary ? `${design.theme.customColors.primary}20` : '#f3f4f6',
                  color: design?.theme?.customColors?.primary || '#6b7280'
                }}
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 
          className="auto-blogify-title text-xl font-bold mb-3 line-clamp-2"
          style={{ color: design?.theme?.customColors?.primary || config.theme?.primaryColor || '#333' }}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        {excerpt && showExcerpt && componentSettings.showExcerpt && (
          <p className="auto-blogify-excerpt text-gray-600 mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="auto-blogify-meta flex flex-wrap items-center text-sm text-gray-500 gap-4">
          {/* Author */}
          {showAuthor && componentSettings.showAuthor && post.authorName && (
            <div className="auto-blogify-author flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>{post.authorName}</span>
            </div>
          )}

          {/* Date */}
          {showDate && componentSettings.showDate && post.publishedAt && (
            <div className="auto-blogify-date flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{formatDate(post.publishedAt, config.language)}</span>
            </div>
          )}

          {/* Reading Time */}
          {showReadingTime && componentSettings.showReadingTime && post.readingTime && (
            <div className="auto-blogify-reading-time flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{formatReadingTime(post.readingTime, config.language)}</span>
            </div>
          )}
        </div>

        {/* Content Freshness */}
        {showContentFreshness && post.publishedAt && (
          <div className="mt-3">
            <ContentFreshness
              publishedAt={post.publishedAt}
              updatedAt={post.updatedAt}
              showIndicator={true}
              showLastUpdated={true}
              freshnessThreshold={30}
            />
          </div>
        )}

        {/* Tags */}
        {showTags && componentSettings.showTags && post.tags && post.tags.length > 0 && (
          <div className="auto-blogify-tags mt-4 pt-4 border-t border-gray-100">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block text-xs text-gray-500 mr-2 mb-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SEO structured data */}
      {config.seo?.enableStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.seoDescription || excerpt,
              "image": post.featuredImage,
              "author": {
                "@type": "Person",
                "name": post.authorName
              },
              "datePublished": post.publishedAt,
              "dateModified": post.publishedAt,
              "keywords": post.seoKeywords?.join(', '),
              "articleSection": post.categories?.join(', '),
              "wordCount": post.wordCount,
              "timeRequired": post.readingTime ? `PT${post.readingTime}M` : undefined
            })
          }}
        />
      )}
    </article>
  );
}
