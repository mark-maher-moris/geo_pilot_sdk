# Enhanced Blog Post Structure

This document describes the new enhanced blog post structure that provides a modern, professional layout with all the features requested.

## Overview

The enhanced blog post structure includes:

1. **Site Header & Navigation** - Website branding and navigation
2. **Post Title and Metadata** - Title, cover image, date, and author
3. **Table of Contents (ToC)** - Floating/sticky navigation
4. **Social Share Buttons** - Twitter, Facebook, LinkedIn sharing
5. **Main Content Sections** - Structured content with proper headings
6. **Conclusion/FAQ Sections** - Answering common questions
7. **CTA and Footer** - Call-to-action buttons and simple footer

## Components

### BlogPostEnhanced

The main component that orchestrates the entire blog post structure.

```tsx
import { BlogPostEnhanced } from '@autoblogify/sdk';

<BlogPostEnhanced
  config={config}
  postId="post-id"
  websiteName="My Blog"
  showTOC={true}
  showSocialShare={true}
  // ... other props
/>
```

### BlogSiteHeader

Provides the site header with navigation and branding.

```tsx
<BlogSiteHeader
  websiteName="My Blog"
  blogHomeUrl="/blog"
  mainWebsiteUrl="/"
  logoUrl="/logo.png"
  navigationItems={[
    { label: 'About', url: '/about' },
    { label: 'Contact', url: '/contact' }
  ]}
/>
```

### BlogPostMetadata

Displays the post title, cover image, and metadata (date, author, reading time).

```tsx
<BlogPostMetadata
  title="Blog Post Title"
  coverImage="/cover-image.jpg"
  publishDate="2024-01-01"
  author="John Doe"
  readingTime={5}
/>
```

### BlogTableOfContents

Creates a floating/sticky table of contents that automatically generates from content headings.

```tsx
<BlogTableOfContents
  items={tocItems}
  isSticky={true}
  position="right"
/>
```

### BlogSocialShare

Provides social sharing buttons for Twitter, Facebook, LinkedIn, and email.

```tsx
<BlogSocialShare
  url="https://example.com/post"
  title="Post Title"
  description="Post description"
  platforms={['twitter', 'facebook', 'linkedin']}
  position="inline"
/>
```

### BlogConclusionFAQ

Displays conclusion text and expandable FAQ sections.

```tsx
<BlogConclusionFAQ
  conclusion="This is the conclusion..."
  faqItems={[
    {
      id: 'faq-1',
      question: 'What is this about?',
      answer: 'This is the answer...'
    }
  ]}
/>
```

### BlogCTAFooter

Provides call-to-action buttons and footer content.

```tsx
<BlogCTAFooter
  ctaButtons={[
    {
      id: 'cta-1',
      text: 'Get Started',
      url: '/get-started',
      style: 'primary',
      size: 'lg'
    }
  ]}
  footerText="© 2024 My Blog. All rights reserved."
/>
```

## Content Structure

The blog post content is automatically structured with:

1. **Heading IDs** - Automatically added to all headings for TOC navigation
2. **Section Parsing** - Content is parsed into logical sections
3. **TOC Generation** - Table of contents is automatically generated from headings
4. **Responsive Design** - Mobile-first responsive layout

## Styling and Theming

All components support the design system with:

- **Custom Colors** - Primary, secondary, and accent colors
- **Typography** - Consistent font families and sizes
- **Spacing** - Consistent margins and padding
- **Responsive Breakpoints** - Mobile, tablet, and desktop layouts

## Usage Examples

### Basic Usage

```tsx
import { BlogPostEnhanced, AutoBlogifyProvider } from '@autoblogify/sdk';

const config = {
  apiUrl: 'https://your-api.com',
  projectId: 'your-project-id',
  theme: {
    primaryColor: '#3B82F6',
    customColors: {
      primary: '#3B82F6',
      secondary: '#1E40AF'
    }
  }
};

function MyBlogPost() {
  return (
    <AutoBlogifyProvider config={config}>
      <BlogPostEnhanced
        config={config}
        postId="my-post-id"
        websiteName="My Blog"
        showTOC={true}
        showSocialShare={true}
      />
    </AutoBlogifyProvider>
  );
}
```

### Advanced Configuration

```tsx
<BlogPostEnhanced
  config={config}
  postId="post-id"
  
  // Site configuration
  websiteName="My Awesome Blog"
  blogHomeUrl="/blog"
  mainWebsiteUrl="/"
  logoUrl="/logo.png"
  navigationItems={[
    { label: 'About', url: '/about' },
    { label: 'Services', url: '/services' }
  ]}
  
  // Feature toggles
  showSiteHeader={true}
  showTOC={true}
  showSocialShare={true}
  showConclusionFAQ={true}
  showCTAFooter={true}
  
  // Content customization
  conclusion="This is the conclusion of the blog post..."
  faqItems={[
    {
      id: 'faq-1',
      question: 'What is this about?',
      answer: 'This blog post explains...'
    }
  ]}
  ctaButtons={[
    {
      id: 'cta-1',
      text: 'Get Started',
      url: '/get-started',
      style: 'primary',
      size: 'lg'
    }
  ]}
  footerText="© 2024 My Blog. All rights reserved."
/>
```

## Migration from BlogPost

To migrate from the standard `BlogPost` component to `BlogPostEnhanced`:

1. Replace `BlogPost` with `BlogPostEnhanced`
2. Add site configuration props (websiteName, blogHomeUrl, etc.)
3. Configure feature toggles (showTOC, showSocialShare, etc.)
4. Add content customization (conclusion, faqItems, ctaButtons)
5. Test the new layout and adjust styling as needed

## BlogFullScreen Integration

The `BlogFullScreen` component has been updated to use the enhanced blog post structure. When a user clicks on a blog post, it will automatically display using the new `BlogPostEnhanced` component with all the modern features.

### Enhanced BlogFullScreen Usage

```tsx
import { BlogFullScreen, AutoBlogifyProvider } from '@autoblogify/sdk';

<AutoBlogifyProvider config={config}>
  <BlogFullScreen
    config={config}
    
    // Standard blog list configuration
    showPagination={true}
    showSearch={true}
    showSidebar={true}
    layout="grid"
    
    // Enhanced blog post configuration
    websiteName="My Blog"
    blogHomeUrl="/blog"
    mainWebsiteUrl="/"
    logoUrl="/logo.png"
    navigationItems={[
      { label: 'About', url: '/about' },
      { label: 'Contact', url: '/contact' }
    ]}
    
    // Feature toggles for individual posts
    showSiteHeader={true}
    showTOC={true}
    showSocialShare={true}
    showConclusionFAQ={true}
    showCTAFooter={true}
    
    // Content customization
    conclusion="Thank you for reading!"
    faqItems={faqItems}
    ctaButtons={ctaButtons}
    footerText="© 2024 My Blog. All rights reserved."
  />
</AutoBlogifyProvider>
```

### Key Benefits of Enhanced BlogFullScreen

1. **Seamless Integration** - Blog list and individual posts use the same enhanced structure
2. **Consistent Experience** - All posts display with the same modern layout
3. **Configurable Features** - Control which enhanced features are shown
4. **Backward Compatibility** - Existing BlogFullScreen usage continues to work
5. **Enhanced Navigation** - Better user experience with site header and navigation

## Browser Support

The enhanced blog post structure supports:

- **Modern Browsers** - Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers** - iOS Safari, Chrome Mobile, Samsung Internet
- **Responsive Design** - Works on all screen sizes
- **Accessibility** - WCAG 2.1 AA compliant

## Performance

The enhanced structure is optimized for performance with:

- **Lazy Loading** - Components load as needed
- **Efficient Rendering** - Minimal re-renders
- **Optimized Images** - Responsive image loading
- **Fast Navigation** - Smooth scrolling and transitions

## Customization

You can customize the blog post structure by:

1. **Overriding Styles** - Use custom CSS classes
2. **Modifying Components** - Extend or replace individual components
3. **Adding Features** - Integrate additional functionality
4. **Theming** - Use the design system for consistent styling

## Support

For questions or issues with the enhanced blog post structure:

1. Check the documentation
2. Review the examples
3. Test with the provided sample code
4. Contact support if needed
