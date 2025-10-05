# Auto Blogify SDK

Integrate a complete, backend-driven blog into any Next.js app in minutes.

## What you get

- Easy drop-in components (Next.js friendly)
- SEO-ready (meta, JSON-LD, sitemaps)
- Fully backend-driven styling/settings from your Auto Blogify dashboard
- Geo, analytics, TypeScript support

## Install

```bash
npm install @auto-blogify/sdk
# or
yarn add @auto-blogify/sdk
```

## Quick start

1) Add environment variables (e.g. `.env.local`)

```env
NEXT_PUBLIC_AUTO_BLOGIFY_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_AUTO_BLOGIFY_PROJECT_ID=your-project-id
```

2) Wrap your app

```tsx
// app/layout.tsx or pages/_app.tsx
import { AutoBlogifyProvider, defaultConfig } from '@auto-blogify/sdk';

export default function Layout({ children }) {
  return (
    <AutoBlogifyProvider 
      config={defaultConfig}
    >
      {children}
    </AutoBlogifyProvider>
  );
}
```

3) Render your blog

```tsx
// app/blog/page.tsx
import { BlogFullScreen } from '@auto-blogify/sdk';

export default function BlogPage() {
  return (
    <BlogFullScreen />
  );
}
```

That’s it. All styling, layout, typography, and component visibility are controlled in your Auto Blogify dashboard.

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
import { useBlogPosts } from '@auto-blogify/sdk';

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
import { AutoBlogifyAPI } from '@auto-blogify/sdk';

const api = new AutoBlogifyAPI({
  apiUrl: process.env.AUTO_BLOGIFY_API_URL!,
  projectId: process.env.AUTO_BLOGIFY_PROJECT_ID!
});

const { posts } = await api.getBlogPosts({ limit: 10 });
```

## Notes

- The SDK is backend-driven. Prefer configuring styles and behavior in the dashboard.
- Keep Next.js images configured for your asset domains if needed.

## More docs

- Blog post data structure: `sdk/docs/BLOG_POST_STRUCTURE.md`
- Examples: `sdk/examples/simple-usage.tsx`

## Support

- Email: support@auto-blogify.com
- Docs: https://docs.auto-blogify.com
- Discord: https://discord.gg/auto-blogify
- Issues: https://github.com/auto-blogify/sdk/issues

MIT © Auto Blogify
