import React from 'react';
import { applyHeadingFontStyles, applyBodyFontStyles } from '../../utils/themeUtils';

interface BlogHeaderProps {
  config: any;
  design: any;
  metadata: any;
}

export const BlogHeader = React.memo(function BlogHeader({ config, design, metadata }: BlogHeaderProps) {
  // Try to get project name from multiple sources
  const projectName = metadata?.projectName || config?.projectName || config?.title || 'Blog';
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <h1 
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ 
              ...applyHeadingFontStyles(design),
              color: design?.theme?.customColors?.primary || 
                     config.theme?.primaryColor || 
                     '#333' 
            }}
          >
            {projectName}
          </h1>
          {metadata?.description && (
            <p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              style={applyBodyFontStyles(design)}
            >
              {metadata.description}
            </p>
          )}
        </div>
      </div>
    </header>
  );
});
