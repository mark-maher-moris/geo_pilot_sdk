import * as React from 'react';
import { useMemo } from 'react';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { applyDesignStyles } from '../utils/themeUtils';

export interface BreadcrumbItem {
  label: string;
  url: string;
  position: number;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeLabel?: string;
  homeUrl?: string;
  separator?: string;
  className?: string;
  style?: React.CSSProperties;
  enableStructuredData?: boolean;
}

export function Breadcrumbs({
  items,
  showHome = true,
  homeLabel = 'Home',
  homeUrl = '/',
  separator = '/',
  className = '',
  style,
  enableStructuredData = true
}: BreadcrumbsProps) {
  const { design } = useGEOPilot();

  const breadcrumbItems = useMemo(() => {
    const allItems: BreadcrumbItem[] = [];
    
    if (showHome) {
      allItems.push({
        label: homeLabel,
        url: homeUrl,
        position: 1
      });
    }

    // Add other items with adjusted positions
    items.forEach((item, index) => {
      allItems.push({
        ...item,
        position: showHome ? index + 2 : index + 1
      });
    });

    return allItems;
  }, [items, showHome, homeLabel, homeUrl]);

  const containerClasses = useMemo(() => {
    return `
      auto-blogify-breadcrumbs
      flex
      items-center
      space-x-2
      text-sm
      text-gray-600
      ${className}
    `.trim().replace(/\s+/g, ' ');
  }, [className]);

  const containerStyles = useMemo(() => {
    return applyDesignStyles(design, style);
  }, [design, style]);

  const linkClasses = useMemo(() => {
    return `
      hover:text-gray-900
      transition-colors
      duration-200
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:ring-opacity-50
      rounded
      px-1
      py-0.5
    `.trim().replace(/\s+/g, ' ');
  }, []);

  const currentItemClasses = useMemo(() => {
    return `
      text-gray-900
      font-medium
      ${design?.theme?.customColors?.primary ? '' : 'text-blue-600'}
    `.trim().replace(/\s+/g, ' ');
  }, [design]);

  const structuredData = useMemo(() => {
    if (!enableStructuredData) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map(item => ({
        "@type": "ListItem",
        "position": item.position,
        "name": item.label,
        "item": item.url
      }))
    };
  }, [breadcrumbItems, enableStructuredData]);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav 
        className={containerClasses}
        style={containerStyles}
        aria-label="Breadcrumb"
        role="navigation"
      >
        <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
          {breadcrumbItems.map((item, index) => (
            <li 
              key={item.position}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <span 
                  className="mx-2 text-gray-400"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
              
              {index === breadcrumbItems.length - 1 ? (
                // Current page (last item)
                <span 
                  className={currentItemClasses}
                  style={{ 
                    color: design?.theme?.customColors?.primary || '#2563EB'
                  }}
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                // Link to other pages
                <a
                  href={item.url}
                  className={linkClasses}
                  itemProp="item"
                  style={{
                    color: design?.theme?.customColors?.primary ? `${design.theme.customColors.primary}80` : '#6B7280'
                  }}
                >
                  <span itemProp="name">{item.label}</span>
                </a>
              )}
              
              <meta itemProp="position" content={item.position.toString()} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
