import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { AutoBlogifyAPI } from '../services/api';
import { AutoBlogifyContext } from '../hooks/useAutoBlogify';
import { AutoBlogifyConfig, BlogDesignConfig } from '../types';
import { mergeThemeConfig } from '../utils/themeUtils';

export interface AutoBlogifyProviderProps {
  config: AutoBlogifyConfig;
  children: React.ReactNode;
}

export function AutoBlogifyProvider({ config, children }: AutoBlogifyProviderProps) {
  const [api, setApi] = useState<AutoBlogifyAPI | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<AutoBlogifyConfig>(config);
  const [design, setDesign] = useState<BlogDesignConfig | null>(null);
  const [designLoading, setDesignLoading] = useState(true);
  const [designError, setDesignError] = useState<string | null>(null);

  // Initialize API first
  useEffect(() => {
    const apiInstance = new AutoBlogifyAPI(currentConfig);
    setApi(apiInstance);
    setApiReady(true);
  }, [currentConfig]);

  // Fetch design configuration after API is initialized
  useEffect(() => {
    if (!api || !currentConfig.projectId) return;

    const fetchDesign = async () => {
      try {
        setDesignLoading(true);
        setDesignError(null);

        // Check localStorage first for real-time updates
        const cachedDesign = localStorage.getItem(`blog-design-${currentConfig.projectId}`);
        if (cachedDesign) {
          try {
            const parsedDesign = JSON.parse(cachedDesign);
            setDesign(parsedDesign);
            setDesignLoading(false);
            return;
          } catch (error) {
            console.warn('Error parsing cached design:', error);
          }
        }

        // Fetch design configuration from the backend using the public preview endpoint
        const response = await fetch(`${currentConfig.apiUrl}/blog-design/${currentConfig.projectId}/public-preview`, {
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
          localStorage.setItem(`blog-design-${currentConfig.projectId}`, JSON.stringify(result.data.design));
        } else {
          // Set minimal design configuration if none exists
          const minimalDesign = {
            theme: {
              id: 'minimal',
              name: 'Minimal',
              colorScheme: 'light',
              customColors: {
                primary: '#3B82F6',
                secondary: '#6B7280',
                accent: '#10B981',
                background: '#FFFFFF',
                surface: '#F9FAFB',
                text: '#111827',
                heading: '#111827',
                textSecondary: '#6B7280',
                border: '#E5E7EB',
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444'
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
          localStorage.setItem(`blog-design-${currentConfig.projectId}`, JSON.stringify(minimalDesign));
        }
      } catch (err) {
        console.error('Error fetching blog design:', err);
        setDesignError(err instanceof Error ? err.message : 'Failed to fetch design');
        // Fallback to minimal design configuration
        const minimalDesign = {
          theme: {
            id: 'minimal',
            name: 'Minimal',
            colorScheme: 'light',
            customColors: {
              primary: '#3B82F6',
              secondary: '#6B7280',
              accent: '#10B981',
              background: '#FFFFFF',
              surface: '#F9FAFB',
              text: '#111827',
              heading: '#111827',
              textSecondary: '#6B7280',
              border: '#E5E7EB',
              success: '#10B981',
              warning: '#F59E0B',
              error: '#EF4444'
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
        localStorage.setItem(`blog-design-${currentConfig.projectId}`, JSON.stringify(minimalDesign));
      } finally {
        setDesignLoading(false);
      }
    };

    fetchDesign();
  }, [api, currentConfig.projectId, currentConfig.apiUrl]);

  // Merge static config with dynamic design
  const mergedConfig = React.useMemo(() => {
    return mergeThemeConfig(currentConfig, design);
  }, [currentConfig, design]);

  const updateConfig = useCallback((newConfig: Partial<AutoBlogifyConfig>) => {
    setCurrentConfig(prev => {
      const updated = { ...prev, ...newConfig };
      
      // Update API config if API instance exists
      if (api) {
        api.updateConfig(newConfig);
      }
      
      return updated;
    });
  }, [api]);

  const contextValue = {
    api,
    apiReady,
    config: mergedConfig,
    updateConfig,
    design,
    designLoading,
    designError
  };

  return (
    <AutoBlogifyContext.Provider value={contextValue}>
      {children}
    </AutoBlogifyContext.Provider>
  );
}

