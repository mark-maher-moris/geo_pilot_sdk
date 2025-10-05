# GEO Pilot SDK

Integrate advanced geospatial blog and content management capabilities into any Next.js app in minutes.

## What you get

- Easy drop-in components (Next.js friendly)
- Advanced geospatial features and location-based content
- SEO-ready (meta, JSON-LD, sitemaps)
- Fully backend-driven styling/settings from your GEO Pilot dashboard
- Geo, analytics, TypeScript support
- Location-based content targeting and filtering

## Install

```bash
npm install @geo-pilot/sdk
# or
yarn add @geo-pilot/sdk
```

## Quick start

1) Add environment variables (e.g. `.env.local`)

```env
NEXT_PUBLIC_GEO_PILOT_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_GEO_PILOT_PROJECT_ID=your-project-id
```

2) Wrap your app

```tsx
// app/layout.tsx or pages/_app.tsx
import { GEOPilotProvider, defaultConfig } from '@geo-pilot/sdk';

export default function Layout({ children }) {
  return (
    <GEOPilotProvider 
      config={defaultConfig}
    >
      {children}
    </GEOPilotProvider>
  );
}
```

3) Render your blog

```tsx
// app/blog/page.tsx
import { BlogFullScreen } from '@geo-pilot/sdk';

export default function BlogPage() {
  return (
    <BlogFullScreen />
  );
}
```

That's it. All styling, layout, typography, and component visibility are controlled in your GEO Pilot dashboard.

## Minimal config (optional)

```tsx
<BlogFullScreen 
  config={{
    apiUrl: 'https://your-api-domain.com/api',
    projectId: 'your-project-id'
  }}
/>
```

## Key components

- BlogFullScreen: All-in-one blog UI (list, filters, post view, pagination)
- SEOHead: Drop-in SEO tags for pages/posts

## Useful hooks

- useBlogPosts: List and paginate posts
- useBlogPost: Fetch a single post by slug/id
- useBlogMetadata: Read blog metadata/config

Example:

```tsx
import { useBlogPosts } from '@geo-pilot/sdk';

function Posts() {
  const { posts, loading } = useBlogPosts({ page: 1, limit: 10 });
  if (loading) return <div>Loading...</div>;
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

## Server usage

```tsx
import { GEOPilotAPI } from '@geo-pilot/sdk';

const api = new GEOPilotAPI({
  apiUrl: process.env.GEO_PILOT_API_URL!,
  projectId: process.env.GEO_PILOT_PROJECT_ID!
});

const { posts } = await api.getBlogPosts({ limit: 10 });
```

## Notes

- The SDK is backend-driven. Prefer configuring styles and behavior in the dashboard.
- Keep Next.js images configured for your asset domains if needed.
- Advanced geospatial features require proper API configuration.

## More docs

- Blog post data structure: `sdk/docs/BLOG_POST_STRUCTURE.md`
- Examples: `sdk/examples/simple-usage.tsx`

## Support

- Website: https://geopilot.buildagon.com
- GitHub: https://github.com/mark-maher-moris/geo_pilot_sdk
- Issues: https://github.com/mark-maher-moris/geo_pilot_sdk/issues

MIT © GEO Pilot
