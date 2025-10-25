import React from 'react';
import { useState, useMemo } from 'react';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { applyDesignStyles, applyHeadingFontStyles, applyBodyFontStyles, getHeadingFontFamilyCSS, getBodyFontFamilyCSS } from '../utils/themeUtils';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BlogConclusionFAQProps {
  conclusion?: string;
  faqItems?: FAQItem[];
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function BlogConclusionFAQ({
  conclusion,
  faqItems = [],
  title = "Answering Your Top Questions",
  className = '',
  style
}: BlogConclusionFAQProps) {
  const { design } = useGEOPilot();
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const containerClasses = useMemo(() => {
    return `
      auto-blogify-conclusion-faq
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

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className={containerClasses} style={containerStyles}>
      {/* Conclusion Section */}
      {conclusion && (
        <div className="mb-12">
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ 
              ...applyHeadingFontStyles(design),
              color: design?.theme?.customColors?.primary || '#111827'
            }}
          >
            Conclusion
          </h2>
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: conclusion }}
            style={{ 
              ...applyBodyFontStyles(design),
              '--tw-prose-body': design?.theme?.customColors?.primary || '#374151',
              '--tw-prose-headings': design?.theme?.customColors?.primary || '#111827',
              '--tw-prose-links': design?.theme?.customColors?.primary || '#3B82F6',
              '--tw-prose-headings-font-family': getHeadingFontFamilyCSS(design),
              '--tw-prose-body-font-family': getBodyFontFamilyCSS(design)
            } as React.CSSProperties}
          />
        </div>
      )}

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <div>
          <h2 
            className="text-3xl font-bold mb-8"
            style={{ 
              ...applyHeadingFontStyles(design),
              color: design?.theme?.customColors?.primary || '#111827'
            }}
          >
            {title}
          </h2>
          
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex justify-between items-center">
                    <h3 
                      className="text-lg font-semibold"
                      style={{ 
                        color: design?.theme?.customColors?.primary || '#111827'
                      }}
                    >
                      {item.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        openFAQ === item.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                
                {openFAQ === item.id && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <div 
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                      style={{ 
                        '--tw-prose-body': design?.theme?.customColors?.primary || '#374151',
                        '--tw-prose-headings': design?.theme?.customColors?.primary || '#111827',
                        '--tw-prose-links': design?.theme?.customColors?.primary || '#3B82F6'
                      } as React.CSSProperties}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
