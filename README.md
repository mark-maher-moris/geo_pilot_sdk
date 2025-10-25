# Geo Pilot SDK

Integrate advanced geospatial blog and content management capabilities into any Next.js app in minutes.

## What you get

- **Easy drop-in components** (Next.js friendly)
- **React 18 compatible** with full SSR support
- **Advanced geospatial features** and location-based content
- **SEO-ready** (meta tags, JSON-LD, sitemaps)
- **Fully backend-driven** styling and settings from your Geo Pilot dashboard
- **TypeScript support** with comprehensive type definitions
- **Performance optimized** with lazy loading and caching
- **Responsive design** that works on all devices
- **Accessibility compliant** (WCAG 2.1 AA)

## Install

```bash
npm install geo-pilot-sdk
# or
yarn add geo-pilot-sdk
```

### Requirements

- **React**: 18.0.0 or higher
- **Next.js**: 12.0.0 or higher (recommended 13+)
- **Node.js**: 16.0.0 or higher

## Quick start

1) Add environment variables (e.g. `.env.local`)

```env
NEXT_PUBLIC_GEO_PILOT_PROJECT_ID=your-project-id
NEXT_PUBLIC_GEO_PILOT_SECRET_KEY=your-secret-key
```

2) Wrap your app

```tsx
// app/layout.tsx or pages/_app.tsx
import { GEOPilotProvider, defaultConfig } from 'geo-pilot-sdk';

export default function Layout({ children }) {
  return (
    <GEOPilotProvider 
      config={{
        ...defaultConfig,
        projectId: process.env.NEXT_PUBLIC_GEO_PILOT_PROJECT_ID!,
        secretKey: process.env.NEXT_PUBLIC_GEO_PILOT_SECRET_KEY!
      }}
    >
      {children}
    </GEOPilotProvider>
  );
}
```

> **Note**: The SDK is fully compatible with React 18 and includes proper SSR support. No additional configuration needed!

3) Render your blog

```tsx
// app/blog/page.tsx
import { BlogFullScreen } from 'geo-pilot-sdk';

export default function BlogPage() {
  return (
    <BlogFullScreen />
  );
}
```

That's it! All styling, layout, typography, and component visibility are controlled from your Geo Pilot dashboard.

## BlogFullScreen Component

The main all-in-one blog component that provides a complete blogging experience:

```tsx
import { BlogFullScreen } from 'geo-pilot-sdk';

<BlogFullScreen 
  // Optional props
  page={1}
  limit={10}
  category="tech"
  searchQuery="react"
  onPostClick={(post) => console.log('Post clicked:', post)}
/>
```

## Configuration

The SDK uses a fixed API URL and only requires your project credentials:

```tsx
const config = {
  projectId: 'your-project-id',
  secretKey: 'your-secret-key'
};
```

## Advanced Usage

### Custom Styling

```tsx
<BlogFullScreen 
  className="my-custom-blog-styles"
  style={{ maxWidth: '1200px', margin: '0 auto' }}
/>
```

### With Custom Configuration

```tsx
<BlogFullScreen 
  config={{
    projectId: 'your-project-id',
    secretKey: 'your-secret-key',
    // All other settings come from your Geo Pilot dashboard
  }}
/>
```

## Complete Example

```tsx
import { GEOPilotProvider, BlogFullScreen, defaultConfig } from 'geo-pilot-sdk';

export default function BlogPage() {
  const config = {
    ...defaultConfig,
    projectId: process.env.NEXT_PUBLIC_GEO_PILOT_PROJECT_ID!,
    secretKey: process.env.NEXT_PUBLIC_GEO_PILOT_SECRET_KEY!
  };

  return (
    <GEOPilotProvider config={config}>
      <div className="min-h-screen">
        <header>
          <h1>My Blog</h1>
        </header>
        
        <main>
          <BlogFullScreen />
        </main>
        
        <footer>
          <p>&copy; 2024 My Blog. All rights reserved.</p>
        </footer>
      </div>
    </GEOPilotProvider>
  );
}
```

## Features

- **React 18 Compatible**: Full support for React 18 with proper SSR handling
- **Backend-driven configuration**: All styling and settings controlled from your dashboard
- **SEO optimized**: Automatic meta tags, structured data, and Open Graph
- **Performance optimized**: Lazy loading, caching, and image optimization
- **Responsive design**: Works perfectly on all devices
- **Accessibility**: WCAG 2.1 AA compliant
- **TypeScript support**: Full type definitions included
- **SSR Safe**: No hydration mismatches or server-side rendering issues

## Troubleshooting

### Quick Fix for `createContext is not a function` Error

If you're getting this error, you're likely using an outdated SDK version:

```bash
# Update to the latest version
npm install @geo-pilot/sdk@latest

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Common Issues

**Error**: `useGEOPilot must be used within a GEOPilotProvider`
**Solution**: Wrap your app with `GEOPilotProvider` as shown in the quick start guide.

**Error**: Hydration mismatch warnings
**Solution**: The SDK includes proper SSR handling. If you still see warnings, ensure you're using the latest version.

### Detailed Troubleshooting

For comprehensive troubleshooting steps, see our [Troubleshooting Guide](./TROUBLESHOOTING.md).

## Support

- **GitHub**: [https://github.com/mark-maher-moris/geo_pilot_sdk](https://github.com/mark-maher-moris/geo_pilot_sdk)
- **Issues**: [https://github.com/mark-maher-moris/geo_pilot_sdk/issues](https://github.com/mark-maher-moris/geo_pilot_sdk/issues)

## License

MIT © Geo Pilot

---

**Version**: 1.0.1  
**Last Updated**: January 2025  
**React Compatibility**: 18.0.0+