import React from 'react';
import { AutoBlogifyProvider, BlogFullScreen, defaultConfig } from '@auto-blogify/sdk';

// Simple usage example - just wrap your app and use BlogFullScreen
// The SDK now automatically reads styling and configuration from the backend
export default function SimpleBlogIntegration() {
  return (
    <AutoBlogifyProvider 
      config={{
        ...defaultConfig,
        apiUrl: "https://your-api-domain.com/api",
        projectId: "your-project-id"
      }}
    >
      <div className="min-h-screen">
        <h1>My Website</h1>
        
        {/* BlogFullScreen automatically uses backend configuration */}
        {/* All styling, layout, and settings come from your Auto Blogify dashboard */}
        <BlogFullScreen 
          config={{
            ...defaultConfig,
            apiUrl: "https://your-api-domain.com/api",
            projectId: "your-project-id"
          }}
        />
      </div>
    </AutoBlogifyProvider>
  );
}

// Even simpler - just the blog component
// All styling and configuration comes from the backend automatically
export function JustTheBlog() {
  return (
    <BlogFullScreen 
      config={{
        ...defaultConfig,
        apiUrl: "https://your-api-domain.com/api",
        projectId: "your-project-id"
      }}
      className="my-blog-container"
    />
  );
}

// Minimal usage - just provide the config and everything else is automatic
export function MinimalBlog() {
  return (
    <BlogFullScreen 
      config={{
        ...defaultConfig,
        apiUrl: "https://your-api-domain.com/api",
        projectId: "your-project-id"
      }}
    />
  );
}

// Example with custom styling (only className and style allowed)
export function CustomStyledBlog() {
  return (
    <BlogFullScreen 
      config={{
        ...defaultConfig,
        apiUrl: "https://your-api-domain.com/api",
        projectId: "your-project-id"
      }}
      className="custom-blog-styles"
      style={{ maxWidth: '1200px', margin: '0 auto' }}
    />
  );
}
