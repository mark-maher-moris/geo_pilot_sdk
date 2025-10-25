import React from 'react';
import { useMemo } from 'react';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { applyDesignStyles } from '../utils/themeUtils';

export interface CTAButton {
  id: string;
  text: string;
  url: string;
  style: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
}

export interface BlogCTAFooterProps {
  ctaButtons?: CTAButton[];
  footerText?: string;
  showFooter?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function BlogCTAFooter({
  ctaButtons = [],
  footerText = "© 2024 Your Website. All rights reserved.",
  showFooter = true,
  className = '',
  style
}: BlogCTAFooterProps) {
  const { design } = useGEOPilot();

  const containerClasses = useMemo(() => {
    return `
      auto-blogify-cta-footer
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

  const getButtonClasses = (buttonStyle: string, size: string) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const styleClasses = {
      primary: 'text-white shadow-sm hover:opacity-90 focus:ring-blue-500',
      secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return `${baseClasses} ${styleClasses[buttonStyle as keyof typeof styleClasses]} ${sizeClasses[size as keyof typeof sizeClasses]}`;
  };

  const getButtonStyles = (buttonStyle: string) => {
    if (buttonStyle === 'primary') {
      return {
        backgroundColor: design?.theme?.customColors?.primary || '#3B82F6'
      };
    }
    return {};
  };

  return (
    <div className={containerClasses} style={containerStyles}>
      {/* CTA Section */}
      {ctaButtons.length > 0 && (
        <div className="mb-12 text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ 
                color: design?.theme?.customColors?.primary || '#111827'
              }}
            >
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Take the next step and explore more content or get in touch with us.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaButtons.map((button) => (
                <a
                  key={button.id}
                  href={button.url}
                  className={getButtonClasses(button.style, button.size)}
                  style={getButtonStyles(button.style)}
                >
                  {button.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {showFooter && (
        <footer className="border-t border-gray-200 pt-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {footerText}
            </p>
            
            {/* Optional footer links */}
            <div className="mt-4 flex justify-center space-x-6">
              <a 
                href="/privacy" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="/contact" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
