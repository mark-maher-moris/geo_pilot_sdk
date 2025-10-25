import * as React from 'react';
import { BlogPost, GEOPilotConfig } from '../types';

export interface SEOHeadProps {
  post?: BlogPost;
  config: GEOPilotConfig;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: any[];
  metaTags?: any;
  enableAdvancedSEO?: boolean;
  enablePerformanceOptimizations?: boolean;
}

export function SEOHead({
  post,
  config,
  title,
  description,
  image,
  url,
  type = post ? 'article' : 'website',
  structuredData,
  metaTags,
  enableAdvancedSEO = true,
  enablePerformanceOptimizations = true
}: SEOHeadProps) {
  const seoConfig = config.seo || {};
  const baseUrl = config.customDomain || (typeof window !== 'undefined' ? window.location.origin : '');
  
  // Use provided meta tags or generate defaults
  const finalMetaTags = metaTags || {
    title: title || post?.seoTitle || post?.title || 'Blog',
    description: description || post?.seoDescription || post?.excerpt || 'Blog posts',
    canonical: url || (typeof window !== 'undefined' ? window.location.href : baseUrl),
    ogTitle: title || post?.seoTitle || post?.title || 'Blog',
    ogDescription: description || post?.seoDescription || post?.excerpt || 'Blog posts',
    ogImage: image || post?.featuredImage || `${baseUrl}/og-image.png`,
    ogUrl: url || (typeof window !== 'undefined' ? window.location.href : baseUrl),
    ogType: type,
    ogSiteName: 'Blog',
    twitterCard: 'summary_large_image',
    twitterTitle: title || post?.seoTitle || post?.title || 'Blog',
    twitterDescription: description || post?.seoDescription || post?.excerpt || 'Blog posts',
    twitterImage: image || post?.featuredImage || `${baseUrl}/og-image.png`,
    robots: (post?.status === 'published' || !post?.status) ? 'index, follow' : 'noindex, nofollow'
  };
  
  // Determine values
  const finalTitle = finalMetaTags.title;
  const finalDescription = finalMetaTags.description;
  const finalImage = finalMetaTags.ogImage;
  const finalUrl = finalMetaTags.canonical;
  
  // Keywords
  const keywords = post?.seoKeywords?.join(', ') || '';
  
  // Canonical URL
  const canonicalUrl = seoConfig.canonicalUrl || finalUrl;

  // Performance optimizations - only run in browser
  React.useEffect(() => {
    if (typeof window !== 'undefined' && enablePerformanceOptimizations) {
      // Preload critical images
      if (finalImage) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = finalImage;
        link.as = 'image';
        document.head.appendChild(link);
      }
      
      // Preconnect to API domain
      const baseUrl = (config as any).apiUrl || 'https://geopilotbackend.vercel.app';
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = new URL(baseUrl).origin;
      document.head.appendChild(link);
      
      // DNS prefetch for external domains
      if (config.customDomain) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = config.customDomain;
        document.head.appendChild(link);
      }
    }
  }, [enablePerformanceOptimizations, finalImage, config.customDomain]);

  // Set meta tags in browser environment only
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = finalTitle;
      
      // Set meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', finalDescription);
      
      // Set keywords if provided
      if (keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', keywords);
      }
      
      // Set robots
      let metaRobots = document.querySelector('meta[name="robots"]');
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'index, follow');
      
      // Set canonical URL
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonicalUrl);
    }
  }, [finalTitle, finalDescription, keywords, canonicalUrl]);

  // Return only structured data - no DOM manipulation during build
  return (
    <React.Fragment>
      {/* Structured Data - This is safe to render in App Router */}
      {enableAdvancedSEO && structuredData && structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}
      
      {/* Default Structured Data if not provided */}
      {enableAdvancedSEO && !structuredData && post && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": finalTitle,
              "description": finalDescription,
              "image": finalImage,
              "url": finalUrl,
              "datePublished": post.publishedAt,
              "dateModified": post.updatedAt || post.publishedAt,
              "author": {
                "@type": "Person",
                "name": post.author || post.authorName || "Blog Author"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Blog",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${baseUrl}/logo.png`
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": finalUrl
              }
            })
          }}
        />
      )}
    </React.Fragment>
  );
}
