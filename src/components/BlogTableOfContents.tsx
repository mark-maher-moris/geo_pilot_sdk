import React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { applyDesignStyles } from '../utils/themeUtils';

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

export interface BlogTableOfContentsProps {
  items: TableOfContentsItem[];
  isSticky?: boolean;
  position?: 'left' | 'right' | 'sidebar';
  className?: string;
  style?: React.CSSProperties;
}

export function BlogTableOfContents({
  items,
  isSticky = true,
  position = 'right',
  className = '',
  style
}: BlogTableOfContentsProps) {
  const { design } = useGEOPilot();
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  // Generate table of contents from content headings
  const generateTOC = (content: string): TableOfContentsItem[] => {
    const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
    const headings: TableOfContentsItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const id = match[2];
      const title = match[3].replace(/<[^>]*>/g, ''); // Remove HTML tags

      headings.push({
        id,
        title,
        level
      });
    }

    return headings;
  };

  // Flatten TOC items for easier rendering
  const flattenedItems = useMemo(() => {
    const flatten = (items: TableOfContentsItem[], level = 0): TableOfContentsItem[] => {
      return items.reduce((acc: TableOfContentsItem[], item) => {
        acc.push({ ...item, level });
        if (item.children) {
          acc.push(...flatten(item.children, level + 1));
        }
        return acc;
      }, []);
    };
    return flatten(items);
  }, [items]);

  // Intersection Observer to track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    // Observe all headings
    flattenedItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [flattenedItems]);

  // Show/hide TOC based on scroll position - always visible for sidebar and fixed positions
  useEffect(() => {
    const handleScroll = () => {
      if (position === 'sidebar' || position === 'left' || position === 'right') {
        setIsVisible(true);
      } else {
        const scrollTop = window.pageYOffset;
        setIsVisible(scrollTop > 300);
      }
    };

    // For sidebar and fixed positions, set visible immediately
    if (position === 'sidebar' || position === 'left' || position === 'right') {
      setIsVisible(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [position]);

  const containerClasses = useMemo(() => {
    const baseClasses = `
      auto-blogify-toc
      bg-white
      border
      border-gray-200
      rounded-lg
      shadow-lg
      p-6
      max-w-sm
    `;

    // Handle different positioning modes
    let positionClasses = '';
    let stickyClasses = '';
    let zIndexClasses = '';

    if (position === 'sidebar') {
      // Sidebar mode - normal flow with optional sticky
      positionClasses = 'block';
      stickyClasses = isSticky ? 'sticky top-24' : '';
      zIndexClasses = 'z-10';
    } else if (position === 'left') {
      // Fixed on the left for desktop so it follows scrolling
      positionClasses = 'hidden lg:block fixed left-6 top-24';
      stickyClasses = '';
      zIndexClasses = 'z-20';
    } else {
      // Fixed on the right for desktop so it follows scrolling
      positionClasses = 'hidden lg:block fixed right-6 top-24';
      stickyClasses = '';
      zIndexClasses = 'z-20';
    }

    return `${baseClasses} ${positionClasses} ${stickyClasses} ${zIndexClasses} ${className}`.trim().replace(/\s+/g, ' ');
  }, [position, isSticky, className]);

  const containerStyles = useMemo(() => {
    const base = applyDesignStyles(design, style) || {};
    const shouldConstrainHeight = position === 'sidebar' || isSticky;
    return {
      ...base,
      ...(shouldConstrainHeight
        ? {
            maxHeight: 'calc(100vh - 6rem)',
            overflowY: 'auto'
          }
        : {})
    } as React.CSSProperties;
  }, [design, style, position, isSticky]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!flattenedItems.length) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button - Only show for floating positions */}
      {position !== 'sidebar' && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden fixed left-6 top-6 z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
          aria-label="Toggle Table of Contents"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile TOC Overlay - Only show for floating positions */}
      {position !== 'sidebar' && isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[9998] bg-black bg-opacity-50"
          onClick={() => setIsMobileOpen(false)}
        >
          <div 
            className="fixed left-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 
                  className="text-lg font-semibold"
                  style={{ 
                    color: design?.theme?.customColors?.heading || design?.theme?.customColors?.primary || '#111827'
                  }}
                >
                  Table of Contents
                </h3>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <nav className="space-y-2">
                {flattenedItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      scrollToSection(item.id);
                      setIsMobileOpen(false);
                    }}
                    className={`
                      block w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                      ${activeId === item.id 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                    style={{
                      paddingLeft: `${item.level * 12 + 12}px`,
                      color: activeId === item.id 
                        ? (design?.theme?.customColors?.primary || '#1D4ED8')
                        : undefined
                    }}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Fixed TOC */}
      <div
        ref={tocRef}
        className={`${containerClasses} ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={containerStyles}
      >
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ 
            color: design?.theme?.customColors?.heading || design?.theme?.customColors?.primary || '#111827'
          }}
        >
          Table of Contents
        </h3>
        
        <nav className="space-y-2">
          {flattenedItems.map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(item.id)}
              className={`
                block w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                ${activeId === item.id 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              style={{
                paddingLeft: `${item.level * 12 + 12}px`,
                color: activeId === item.id 
                  ? (design?.theme?.customColors?.primary || '#1D4ED8')
                  : undefined
              }}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
