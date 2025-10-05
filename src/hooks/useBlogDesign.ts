import { useState, useEffect, useCallback } from 'react';
import { useGEOPilot } from './useGEOPilot';
import { BlogDesignConfig } from '../types';

export interface UseBlogDesignResult {
  design: BlogDesignConfig | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateDesign: (updates: Partial<BlogDesignConfig>) => void;
}

export function useBlogDesign(): UseBlogDesignResult {
  const { api, config } = useGEOPilot();
  const [design, setDesign] = useState<BlogDesignConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesign = useCallback(async () => {
    if (!api || !config.projectId) return;

    try {
      setLoading(true);
      setError(null);

      // Check localStorage first for real-time updates
      const cachedDesign = localStorage.getItem(`blog-design-${config.projectId}`);
      if (cachedDesign) {
        try {
          const parsedDesign = JSON.parse(cachedDesign);
          setDesign(parsedDesign);
          setLoading(false);
          return;
        } catch (error) {
          console.warn('Error parsing cached design:', error);
        }
      }

      // Fetch design configuration from the backend using the public preview endpoint
      const response = await fetch(`${config.apiUrl}/blog-design/${config.projectId}/public-preview`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch design: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data?.design) {
        setDesign(result.data.design);
        // Cache the design in localStorage
        localStorage.setItem(`blog-design-${config.projectId}`, JSON.stringify(result.data.design));
      } else {
        // Set minimal design configuration if none exists
        const minimalDesign = {
          theme: {
            id: 'minimal',
            name: 'Minimal',
            colorScheme: 'light',
            customColors: {
              primary: '#3B82F6',
              background: '#FFFFFF',
              text: '#111827',
              heading: '#111827'
            }
          },
          layout: {
            type: 'grid' as const,
            columns: 1,
            spacing: 'md',
            maxWidth: '1200px',
            showSidebar: false,
            sidebarPosition: 'right' as const
          },
          typography: {
            fontFamily: 'inter',
            headingFont: 'inter',
            bodyFont: 'inter'
          },
          components: {
            blogCard: {
              style: 'card',
              showImage: true,
              showAuthor: true,
              showDate: true,
              showExcerpt: true,
              showReadingTime: true,
              showCategories: true,
              showTags: true
            },
            blogPost: {
              showAuthor: true,
              showDate: true,
              showReadingTime: true,
              showShareButtons: true,
              showRelatedPosts: true
            }
          },
          ctaButtons: [],
          blogSettings: {
            audioReader: {
              enabled: false,
              voice: 'auto' as const,
              speed: 1.0,
              autoPlay: false
            },
            sideSection: {
              enabled: true,
              showTableOfContents: true,
              showRelatedPosts: true,
              showSocialShare: true,
              showAuthorBio: true,
              showTags: true,
              showCategories: true
            },
            readingExperience: {
              showProgressBar: true,
              enableDarkMode: true,
              fontSize: 'medium' as const,
              lineHeight: 'normal' as const,
              maxWidth: 'medium' as const
            },
            seo: {
              showMetaDescription: true,
              showSchemaMarkup: true,
              showOpenGraph: true,
              showTwitterCards: true,
              enableBreadcrumbs: true
            },
            social: {
              showShareButtons: true,
              showSocialProof: false,
              showComments: false,
              enableNewsletterSignup: false
            },
            branding: {
              showPoweredBy: true
            }
          }
        };
        setDesign(minimalDesign);
        localStorage.setItem(`blog-design-${config.projectId}`, JSON.stringify(minimalDesign));
      }
    } catch (err) {
      console.error('Error fetching blog design:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch design');
      // Fallback to minimal design configuration
      const minimalDesign = {
        theme: {
          id: 'minimal',
          name: 'Minimal',
          colorScheme: 'light',
          customColors: {
            primary: '#3B82F6',
            background: '#FFFFFF',
            text: '#111827',
            heading: '#111827'
          }
        },
        layout: {
          type: 'grid' as const,
          columns: 1,
          spacing: 'md',
          maxWidth: '1200px',
          showSidebar: false,
          sidebarPosition: 'right' as const
        },
        typography: {
          fontFamily: 'inter',
          headingFont: 'inter',
          bodyFont: 'inter'
        },
        components: {
          blogCard: {
            style: 'card',
            showImage: true,
            showAuthor: true,
            showDate: true,
            showExcerpt: true,
            showReadingTime: true,
            showCategories: true,
            showTags: true
          },
          blogPost: {
            showAuthor: true,
            showDate: true,
            showReadingTime: true,
            showShareButtons: true,
            showRelatedPosts: true
          }
        },
        ctaButtons: [],
        blogSettings: {
          audioReader: {
            enabled: false,
            voice: 'auto' as const,
            speed: 1.0,
            autoPlay: false
          },
          sideSection: {
            enabled: true,
            showTableOfContents: true,
            showRelatedPosts: true,
            showSocialShare: true,
            showAuthorBio: true,
            showTags: true,
            showCategories: true
          },
          readingExperience: {
            showProgressBar: true,
            enableDarkMode: true,
            fontSize: 'medium' as const,
            lineHeight: 'normal' as const,
            maxWidth: 'medium' as const
          },
          seo: {
            showMetaDescription: true,
            showSchemaMarkup: true,
            showOpenGraph: true,
            showTwitterCards: true,
            enableBreadcrumbs: true
          },
          social: {
            showShareButtons: true,
            showSocialProof: false,
            showComments: false,
            enableNewsletterSignup: false
          },
          branding: {
            showPoweredBy: true
          }
        }
      };
      setDesign(minimalDesign);
      localStorage.setItem(`blog-design-${config.projectId}`, JSON.stringify(minimalDesign));
    } finally {
      setLoading(false);
    }
  }, [api, config]);

  const updateDesign = useCallback((updates: Partial<BlogDesignConfig>) => {
    setDesign(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // Listen for design changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `blog-design-${config.projectId}` && e.newValue) {
        try {
          const newDesign = JSON.parse(e.newValue);
          setDesign(newDesign);
        } catch (error) {
          console.error('Error parsing design from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [config.projectId]);

  useEffect(() => {
    fetchDesign();
  }, [fetchDesign]);

  return {
    design,
    loading,
    error,
    refetch: fetchDesign,
    updateDesign
  };
}

function getDefaultDesign(): BlogDesignConfig {
  return {
    theme: {
      id: 'minimal',
      name: 'Minimal',
      colorScheme: 'light',
          customColors: {
            primary: '#3B82F6',
            background: '#FFFFFF',
            text: '#111827',
            heading: '#111827'
          }
    },
    layout: {
      type: 'grid',
      columns: 1,
      spacing: 'md',
      maxWidth: '1200px',
      showSidebar: false,
      sidebarPosition: 'right'
    },
    typography: {
      fontFamily: 'inter',
      headingFont: 'inter',
      bodyFont: 'inter'
    },
    components: {
      blogCard: {
        style: 'card',
        showImage: true,
        showAuthor: true,
        showDate: true,
        showExcerpt: true,
        showReadingTime: true,
        showCategories: true,
        showTags: true
      },
      blogPost: {
        showAuthor: true,
        showDate: true,
        showReadingTime: true,
        showShareButtons: true,
        showRelatedPosts: true
      }
    },
    ctaButtons: []
  };
}
