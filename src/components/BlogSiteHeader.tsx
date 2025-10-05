import * as React from 'react';
import { useMemo } from 'react';
import { useAutoBlogify } from '../hooks/useAutoBlogify';
import { applyDesignStyles, applyHeadingFontStyles } from '../utils/themeUtils';
import { OptimizedImage } from './OptimizedImage';

export interface BlogSiteHeaderProps {
  websiteName?: string;
  blogHomeUrl?: string;
  mainWebsiteUrl?: string;
  logoUrl?: string;
  navigationItems?: Array<{
    label: string;
    url: string;
  }>;
  className?: string;
  style?: React.CSSProperties;
}

export function BlogSiteHeader({
  websiteName = "Website's Blog",
  blogHomeUrl = "/",
  mainWebsiteUrl = "/",
  logoUrl,
  navigationItems = [],
  className = '',
  style
}: BlogSiteHeaderProps) {
  const { design } = useAutoBlogify();

  const headerClasses = useMemo(() => {
    return `
      auto-blogify-site-header
      bg-white
      border-b
      border-gray-200
      sticky
      top-0
      z-50
      ${className}
    `.trim().replace(/\s+/g, ' ');
  }, [className]);

  const headerStyles = useMemo(() => {
    return applyDesignStyles(design, style);
  }, [design, style]);

  return (
    <header className={headerClasses} style={headerStyles}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Website Name */}
          <div className="flex items-center space-x-4">
            {logoUrl && (
              <OptimizedImage
                src={logoUrl}
                alt={`${websiteName} Logo`}
                width={32}
                height={32}
                aspectRatio={1}
                loading="eager"
                className="h-8 w-auto"
                enableResponsive={false}
                preload={true}
              />
            )}
            <a
              href={blogHomeUrl}
              className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
              style={{ 
                ...applyHeadingFontStyles(design),
                color: design?.theme?.customColors?.primary || '#111827'
              }}
            >
              {websiteName}
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href={blogHomeUrl}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Blog Home
            </a>
            
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
            
            <a
              href={mainWebsiteUrl}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors"
              style={{
                backgroundColor: design?.theme?.customColors?.primary || '#3B82F6',
                color: 'white'
              }}
            >
              Visit Main Website
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
