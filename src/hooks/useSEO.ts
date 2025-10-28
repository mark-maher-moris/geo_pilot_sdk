import { useState, useEffect } from 'react';
import { BlogPost, GEOPilotConfig } from '../types';

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  ogLocale: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
  articleAuthor: string;
  articlePublishedTime: string;
  articleModifiedTime: string;
  articleSection: string;
  articleTag: string[];
  robots: string;
  viewport: string;
  themeColor: string;
  msapplicationTileColor: string;
  appleMobileWebAppTitle: string;
  appleMobileWebAppCapable: string;
  appleMobileWebAppStatusBarStyle: string;
}

export interface SEOData {
  metaTags: SEOMetaTags;
  structuredData: any[];
  loading: boolean;
  error: string | null;
}

export function useSEO(
  config: GEOPilotConfig,
  post?: BlogPost,
  type: 'blog' | 'post' = 'post'
): SEOData {
  const [seoData, setSeoData] = useState<SEOData>({
    metaTags: {} as SEOMetaTags,
    structuredData: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!config.projectId) {
      setSeoData({
        metaTags: {} as SEOMetaTags,
        structuredData: [],
        loading: false,
        error: 'Project ID is required'
      });
      return;
    }

    fetchSEOData();
  }, [config.projectId, post?.slug, type]);

  const fetchSEOData = async () => {
    try {
      setSeoData(prev => ({ ...prev, loading: true, error: null }));

      let endpoint = '';
      const baseUrl = (config as any).apiUrl || 'https://geopilotbackend.vercel.app/api';
      if (type === 'post' && post?.slug) {
        endpoint = `${baseUrl}/seo/${config.projectId}/blog/${post.slug}/complete`;
      } else {
        endpoint = `${baseUrl}/seo/${config.projectId}/blog/complete`;
      }

      console.log('Fetching SEO data from:', endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSeoData({
          metaTags: result.data.metaTags,
          structuredData: result.data.structuredData || [],
          loading: false,
          error: null
        });
      } else {
        throw new Error(result.message || 'Failed to fetch SEO data');
      }
    } catch (error) {
      console.error('API request failed:', error);

      // Only use fallback data for demo credentials
      if (config.projectId === 'demo-project') {
        const fallbackData = generateFallbackSEO(post, config, type);
        setSeoData({
          metaTags: fallbackData.metaTags,
          structuredData: fallbackData.structuredData,
          loading: false,
          error: null
        });
      } else {
        setSeoData({
          metaTags: {} as SEOMetaTags,
          structuredData: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch SEO data'
        });
      }
    }
  };

  return seoData;
}

// Fallback SEO data generation
function generateFallbackSEO(
  post?: BlogPost,
  config?: GEOPilotConfig,
  type: 'blog' | 'post' = 'post'
): { metaTags: SEOMetaTags; structuredData: any[] } {
  const baseUrl = config?.customDomain || (typeof window !== 'undefined' ? window.location.origin : '');
  
  if (type === 'post' && post) {
    return {
      metaTags: {
        title: post.seoTitle || post.title || 'Blog Post',
        description: post.seoDescription || post.excerpt || 'Read this blog post',
        keywords: post.seoKeywords || post.tags || [],
        canonical: `${baseUrl}/blog/${post.slug}`,
        ogTitle: post.seoTitle || post.title || 'Blog Post',
        ogDescription: post.seoDescription || post.excerpt || 'Read this blog post',
        ogImage: post.featuredImage || `${baseUrl}/og-image.png`,
        ogUrl: `${baseUrl}/blog/${post.slug}`,
        ogType: 'article',
        ogSiteName: 'Blog',
        ogLocale: 'en_US',
        twitterCard: 'summary_large_image',
        twitterTitle: post.seoTitle || post.title || 'Blog Post',
        twitterDescription: post.seoDescription || post.excerpt || 'Read this blog post',
        twitterImage: post.featuredImage || `${baseUrl}/og-image.png`,
        twitterSite: '@blog',
        twitterCreator: '@blog',
        articleAuthor: post.author || 'Blog Author',
        articlePublishedTime: post.publishedAt,
        articleModifiedTime: post.updatedAt,
        articleSection: post.categories?.[0] || 'Blog',
        articleTag: post.tags || [],
        robots: post.status === 'published' ? 'index, follow' : 'noindex, nofollow',
        viewport: 'width=device-width, initial-scale=1.0',
        themeColor: '#3B82F6',
        msapplicationTileColor: '#3B82F6',
        appleMobileWebAppTitle: post.title || 'Blog',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'default'
      },
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          image: post.featuredImage,
          url: `${baseUrl}/blog/${post.slug}`,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: {
            '@type': 'Person',
            name: post.author || 'Blog Author'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Blog',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`
            }
          }
        }
      ]
    };
  } else {
    return {
      metaTags: {
        title: 'Blog',
        description: 'Latest blog posts and articles',
        keywords: ['blog', 'articles', 'content'],
        canonical: `${baseUrl}/blog`,
        ogTitle: 'Blog',
        ogDescription: 'Latest blog posts and articles',
        ogImage: `${baseUrl}/og-image.png`,
        ogUrl: `${baseUrl}/blog`,
        ogType: 'website',
        ogSiteName: 'Blog',
        ogLocale: 'en_US',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Blog',
        twitterDescription: 'Latest blog posts and articles',
        twitterImage: `${baseUrl}/og-image.png`,
        twitterSite: '@blog',
        twitterCreator: '@blog',
        articleAuthor: '',
        articlePublishedTime: '',
        articleModifiedTime: '',
        articleSection: '',
        articleTag: [],
        robots: 'index, follow',
        viewport: 'width=device-width, initial-scale=1.0',
        themeColor: '#3B82F6',
        msapplicationTileColor: '#3B82F6',
        appleMobileWebAppTitle: 'Blog',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'default'
      },
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Blog',
          url: `${baseUrl}/blog`,
          description: 'Latest blog posts and articles'
        }
      ]
    };
  }
}

// Hook for SEO analysis
export function useSEOAnalysis(config: GEOPilotConfig, post?: BlogPost) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSEO = async () => {
    if (!post?.slug) return;

    try {
      setLoading(true);
      setError(null);

      const baseUrl = (config as any).apiUrl || 'https://geopilotbackend.vercel.app/api';
      const response = await fetch(
        `${baseUrl}/seo/${config.projectId}/blog/${post.slug}/analyze`
      );
      const result = await response.json();

      if (result.success) {
        setAnalysis(result.data);
      } else {
        throw new Error(result.message || 'Failed to analyze SEO');
      }
    } catch (error) {
      console.error('API request failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze SEO');

      // Only set mock data for demo credentials
      if (config.projectId === 'demo-project') {
        setAnalysis({
          score: 85,
          issues: [],
          suggestions: ['Great SEO setup!'],
          readability: 'Good',
          performance: 'Excellent'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post?.slug) {
      analyzeSEO();
    }
  }, [post?.slug]);

  return { analysis, loading, error, refetch: analyzeSEO };
}
