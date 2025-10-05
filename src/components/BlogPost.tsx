import React, { useMemo } from 'react';
import { useBlogPost } from '../hooks/useBlogPost';
import { useSEO } from '../hooks/useSEO';
import { useAutoBlogify } from '../hooks/useAutoBlogify';
import { BlogPostProps } from '../types';
import { BlogSiteHeader } from './BlogSiteHeader';
import { BlogPostMetadata } from './BlogPostMetadata';
import { BlogTableOfContents } from './BlogTableOfContents';
import { BlogSocialShare } from './BlogSocialShare';
import { BlogConclusionFAQ } from './BlogConclusionFAQ';
import { BlogCTAFooter } from './BlogCTAFooter';
import { BlogRelatedPosts } from './BlogRelatedPosts';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { AudioReader } from './AudioReader';
import { SEOHead } from './SEOHead';
import { Breadcrumbs } from './Breadcrumbs';
import { generateStructuredContent } from '../utils/contentUtils';
import { applyDesignStyles, applyHeadingFontStyles, applyBodyFontStyles, getComponentSettings, getHeadingFontFamilyCSS, getBodyFontFamilyCSS } from '../utils/themeUtils';

export interface BlogPostEnhancedProps extends BlogPostProps {
  websiteName?: string;
  blogHomeUrl?: string;
  mainWebsiteUrl?: string;
  logoUrl?: string;
  navigationItems?: Array<{
    label: string;
    url: string;
  }>;
  showSiteHeader?: boolean;
  showTOC?: boolean;
  showSocialShare?: boolean;
  showConclusionFAQ?: boolean;
  showCTAFooter?: boolean;
  showBreadcrumbs?: boolean;
  showContentFreshness?: boolean;
  conclusion?: string;
  faqItems?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  ctaButtons?: Array<{
    id: string;
    text: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline';
    size: 'sm' | 'md' | 'lg';
  }>;
  footerText?: string;
}

export function BlogPost({
  config,
  postId,
  slug,
  onBack,
  showRelatedPosts = true,
  enableComments = false,
  enableSharing = true,
  websiteName = "Website's Blog",
  blogHomeUrl = "/",
  mainWebsiteUrl = "/",
  logoUrl,
  navigationItems = [],
  showSiteHeader = true,
  showTOC = true,
  showSocialShare = true,
  showConclusionFAQ = true,
  showCTAFooter = true,
  showBreadcrumbs = true,
  showContentFreshness = true,
  conclusion,
  faqItems = [],
  ctaButtons = [],
  footerText,
  className = '',
  style
}: BlogPostEnhancedProps) {
  const { design } = useAutoBlogify();
  
  const {
    post,
    loading,
    error,
    refetch
  } = useBlogPost({
    postId,
    slug,
    autoFetch: true,
    trackView: true
  });

  const { metaTags, structuredData, loading: seoLoading } = useSEO(config, post, 'post');

  // Get component settings from design configuration
  const componentSettings = getComponentSettings(design, 'blogPost');
  
  // Get CTA buttons from design configuration if not provided as props
  const designCTAButtons = design?.ctaButtons?.filter(btn => btn.enabled).map(btn => ({
    id: btn.id,
    text: btn.text,
    url: btn.url,
    style: (btn.style === 'primary' || btn.style === 'secondary' || btn.style === 'outline') 
      ? btn.style as 'primary' | 'secondary' | 'outline'
      : 'primary',
    size: (btn.size === 'sm' || btn.size === 'md' || btn.size === 'lg')
      ? btn.size as 'sm' | 'md' | 'lg'
      : 'md'
  })) || [];
  const finalCTAButtons = ctaButtons.length > 0 ? ctaButtons : designCTAButtons;

  // Generate structured content with TOC
  const structuredContent = useMemo(() => {
    if (!post?.content) return { content: '', toc: [], sections: [] };
    return generateStructuredContent(post.content, {
      addIds: true,
      generateTOC: true,
      maxHeadingLevel: 6
    });
  }, [post?.content]);

  const containerClasses = useMemo(() => {
    return `
      auto-blogify-blog-post-enhanced
      min-h-screen
      bg-white
      ${className}
    `.trim().replace(/\s+/g, ' ');
  }, [className]);

  const containerStyles = useMemo(() => {
    return applyDesignStyles(design, style);
  }, [design, style]);

  if (loading) {
    return (
      <div className="auto-blogify-blog-post-loading flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <ErrorMessage 
        message={error || 'Blog post not found'} 
        onRetry={refetch}
        className={className}
        style={style}
      />
    );
  }

  return (
    <>
      {/* SEO Head */}
      <SEOHead 
        post={post} 
        config={config} 
        metaTags={metaTags}
        structuredData={structuredData}
        enableAdvancedSEO={true}
      />

      <div className={containerClasses} style={containerStyles}>
        {/* Custom CSS */}
        {(config.theme?.customCSS || design?.customCSS) && (
          <style dangerouslySetInnerHTML={{ __html: config.theme?.customCSS || design?.customCSS || '' }} />
        )}

        {/* Site Header & Navigation */}
        {showSiteHeader && (
          <BlogSiteHeader
            websiteName={websiteName}
            blogHomeUrl={blogHomeUrl}
            mainWebsiteUrl={mainWebsiteUrl}
            logoUrl={logoUrl}
            navigationItems={navigationItems}
          />
        )}

        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs
              items={[
                { label: 'Blog', url: blogHomeUrl, position: 2 },
                ...(post.categories?.map((category, index) => ({
                  label: category,
                  url: `${blogHomeUrl}?category=${encodeURIComponent(category)}`,
                  position: 3 + index
                })) || []),
                { label: post.title, url: typeof window !== 'undefined' ? window.location.href : '', position: 4 }
              ]}
              showHome={true}
              homeLabel={websiteName}
              homeUrl={mainWebsiteUrl}
              enableStructuredData={true}
            />
          </div>
        )}

        {/* Post Title and Metadata */}
        <BlogPostMetadata
          title={post.title}
          coverImage={post.featuredImage}
          publishDate={post.publishedAt}
          updatedDate={post.updatedAt}
          author={post.authorName}
          readingTime={post.readingTime}
          showContentFreshness={showContentFreshness}
        />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 justify-center">
            {/* Table of Contents Sidebar */}
            {showTOC && structuredContent.toc.length > 0 && (
              <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
                <div className="sticky top-24">
                  <BlogTableOfContents
                    items={structuredContent.toc}
                    isSticky={true}
                    position="sidebar"
                  />
                </div>
              </aside>
            )}
            
            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto lg:mx-0">
              {/* Back Button */}
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Blog
                </button>
              )}

              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="mb-6">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full mr-2 mb-2"
                      style={{ 
                        backgroundColor: design?.theme?.customColors?.primary ? `${design.theme.customColors.primary}20` : '#f3f4f6',
                        color: design?.theme?.customColors?.primary || config.theme?.primaryColor || '#6b7280'
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <div className="text-xl text-gray-600 mb-8 leading-relaxed italic border-l-4 border-gray-200 pl-6">
                  {post.excerpt}
                </div>
              )}

              {/* Audio Reader */}
              <AudioReader 
                post={post} 
                config={config}
                className="mb-6"
              />


              {/* Main Content */}
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: structuredContent.content }}
                style={{ 
                  ...applyBodyFontStyles(design),
                  '--tw-prose-body': design?.theme?.customColors?.primary || config.theme?.primaryColor || '#374151',
                  '--tw-prose-headings': design?.theme?.customColors?.primary || config.theme?.primaryColor || '#111827',
                  '--tw-prose-links': design?.theme?.customColors?.primary || config.theme?.primaryColor || '#3B82F6',
                  '--tw-prose-headings-font-family': getHeadingFontFamilyCSS(design),
                  '--tw-prose-body-font-family': getBodyFontFamilyCSS(design)
                } as React.CSSProperties}
              />

              {/* Tags */}
              {componentSettings.showTags && post.tags && post.tags.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mb-8">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Share - Bottom */}
              {showSocialShare && enableSharing && (
                <BlogSocialShare
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={post.title}
                  description={post.excerpt}
                  position="bottom"
                  className="mb-8"
                />
              )}

              {/* Author Bio */}
              {post.authorName && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                      <span className="text-gray-600 text-xl font-semibold">
                        {post.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{post.authorName}</h3>
                      <p className="text-gray-600">Author</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Conclusion & FAQ */}
              {showConclusionFAQ && (conclusion || faqItems.length > 0) && (
                <BlogConclusionFAQ
                  conclusion={conclusion}
                  faqItems={faqItems}
                />
              )}

              {/* Related Posts */}
              {showRelatedPosts && componentSettings.showRelatedPosts && (
                <div className="border-t border-gray-200 pt-8 mb-8">
                  <BlogRelatedPosts 
                    postId={post.id}
                    config={config}
                    limit={3}
                  />
                </div>
              )}

              {/* Comments Section Placeholder */}
              {enableComments && (
                <div className="border-t border-gray-200 pt-8 mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Comments</h3>
                  <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                    <p>Comments feature would be integrated here with your preferred commenting system.</p>
                    <p className="text-sm mt-2">Supports Disqus, Utterances, or custom implementations.</p>
                  </div>
                </div>
              )}

              {/* CTA & Footer */}
              {showCTAFooter && (
                <BlogCTAFooter
                  ctaButtons={finalCTAButtons}
                  footerText={footerText}
                />
              )}
            </main>

          </div>
        </div>
      </div>

      {/* Structured Data */}
      {config.seo?.enableStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.seoDescription || post.excerpt,
              "image": post.featuredImage,
              "author": {
                "@type": "Person",
                "name": post.authorName
              },
              "publisher": {
                "@type": "Organization",
                "name": websiteName
              },
              "datePublished": post.publishedAt,
              "dateModified": post.publishedAt,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": typeof window !== 'undefined' ? window.location.href : ''
              },
              "keywords": post.seoKeywords?.join(', '),
              "articleSection": post.categories?.join(', '),
              "wordCount": post.wordCount,
              "timeRequired": post.readingTime ? `PT${post.readingTime}M` : undefined
            })
          }}
        />
      )}
    </>
  );
}
