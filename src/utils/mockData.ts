import { BlogPost, BlogMetadata, Pagination } from '../types';

// Mock blog posts for demo purposes
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React 19',
    slug: 'getting-started-with-react-19',
    content: 'React 19 brings exciting new features and improvements...',
    excerpt: 'Learn about the latest features in React 19 and how to use them in your projects.',
    featuredImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    seoTitle: 'Getting Started with React 19 - Complete Guide',
    seoDescription: 'Learn about the latest features in React 19 and how to use them in your projects.',
    seoKeywords: ['react', 'javascript', 'frontend', 'development'],
    categories: ['React', 'JavaScript', 'Frontend'],
    tags: ['react19', 'javascript', 'frontend'],
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    readingTime: 5,
    wordCount: 800,
    authorName: 'John Doe',
    author: 'john-doe',
    status: 'published'
  },
  {
    id: '2',
    title: 'Building Modern Web Applications with Next.js',
    slug: 'building-modern-web-applications-nextjs',
    content: 'Next.js has revolutionized the way we build web applications...',
    excerpt: 'Explore the power of Next.js for building scalable web applications.',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    seoTitle: 'Building Modern Web Applications with Next.js',
    seoDescription: 'Explore the power of Next.js for building scalable web applications.',
    seoKeywords: ['nextjs', 'react', 'web development', 'ssr'],
    categories: ['Next.js', 'React', 'Web Development'],
    tags: ['nextjs', 'react', 'ssr', 'web-development'],
    publishedAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
    readingTime: 8,
    wordCount: 1200,
    authorName: 'Jane Smith',
    author: 'jane-smith',
    status: 'published'
  },
  {
    id: '3',
    title: 'TypeScript Best Practices for Large Applications',
    slug: 'typescript-best-practices-large-applications',
    content: 'TypeScript provides excellent type safety and developer experience...',
    excerpt: 'Learn essential TypeScript patterns and best practices for enterprise applications.',
    featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    seoTitle: 'TypeScript Best Practices for Large Applications',
    seoDescription: 'Learn essential TypeScript patterns and best practices for enterprise applications.',
    seoKeywords: ['typescript', 'javascript', 'enterprise', 'best-practices'],
    categories: ['TypeScript', 'JavaScript', 'Best Practices'],
    tags: ['typescript', 'javascript', 'enterprise', 'best-practices'],
    publishedAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    readingTime: 12,
    wordCount: 1800,
    authorName: 'Mike Johnson',
    author: 'mike-johnson',
    status: 'published'
  },
  {
    id: '4',
    title: 'The Future of Web Development',
    slug: 'future-of-web-development',
    content: 'Web development is constantly evolving with new technologies...',
    excerpt: 'Discover emerging trends and technologies shaping the future of web development.',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
    seoTitle: 'The Future of Web Development - Trends & Technologies',
    seoDescription: 'Discover emerging trends and technologies shaping the future of web development.',
    seoKeywords: ['web development', 'future', 'trends', 'technology'],
    categories: ['Web Development', 'Technology', 'Future'],
    tags: ['web-development', 'future', 'trends', 'technology'],
    publishedAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
    readingTime: 6,
    wordCount: 900,
    authorName: 'Sarah Wilson',
    author: 'sarah-wilson',
    status: 'published'
  },
  {
    id: '5',
    title: 'Mastering CSS Grid and Flexbox',
    slug: 'mastering-css-grid-flexbox',
    content: 'CSS Grid and Flexbox are powerful layout systems...',
    excerpt: 'Master modern CSS layout techniques with Grid and Flexbox for responsive designs.',
    featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop',
    seoTitle: 'Mastering CSS Grid and Flexbox - Layout Guide',
    seoDescription: 'Master modern CSS layout techniques with Grid and Flexbox for responsive designs.',
    seoKeywords: ['css', 'grid', 'flexbox', 'layout', 'responsive'],
    categories: ['CSS', 'Frontend', 'Layout'],
    tags: ['css', 'grid', 'flexbox', 'layout', 'responsive'],
    publishedAt: '2024-01-11T11:45:00Z',
    updatedAt: '2024-01-11T11:45:00Z',
    readingTime: 10,
    wordCount: 1500,
    authorName: 'David Brown',
    author: 'david-brown',
    status: 'published'
  },
  {
    id: '6',
    title: 'Node.js Performance Optimization',
    slug: 'nodejs-performance-optimization',
    content: 'Optimizing Node.js applications for better performance...',
    excerpt: 'Learn techniques to optimize your Node.js applications for better performance and scalability.',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    seoTitle: 'Node.js Performance Optimization - Best Practices',
    seoDescription: 'Learn techniques to optimize your Node.js applications for better performance and scalability.',
    seoKeywords: ['nodejs', 'performance', 'optimization', 'javascript'],
    categories: ['Node.js', 'Performance', 'JavaScript'],
    tags: ['nodejs', 'performance', 'optimization', 'javascript'],
    publishedAt: '2024-01-10T16:30:00Z',
    updatedAt: '2024-01-10T16:30:00Z',
    readingTime: 15,
    wordCount: 2200,
    authorName: 'Emily Davis',
    author: 'emily-davis',
    status: 'published'
  }
];

// Mock blog metadata
export const mockBlogMetadata: BlogMetadata = {
  projectId: 'demo-project',
  projectName: 'Demo Blog',
  description: 'A modern blog showcasing the latest in web development, technology, and programming.',
  seoTitle: 'Demo Blog - Web Development & Technology',
  seoDescription: 'Stay updated with the latest web development trends, React tutorials, and technology insights.',
  defaultAuthor: 'Demo Author',
  language: 'en',
  timezone: 'UTC',
  postsPerPage: 12,
  totalPosts: mockBlogPosts.length
};

// Mock categories
export const mockCategories = ['React', 'JavaScript', 'Next.js', 'TypeScript', 'CSS', 'Node.js', 'Web Development', 'Technology', 'Frontend', 'Performance'];

// Mock tags
export const mockTags = ['react19', 'javascript', 'frontend', 'nextjs', 'typescript', 'css', 'nodejs', 'web-development', 'performance', 'optimization', 'ssr', 'responsive', 'best-practices', 'enterprise', 'future', 'trends', 'technology', 'layout', 'grid', 'flexbox'];

// Generate mock pagination
export function generateMockPagination(
  page: number,
  limit: number,
  total: number
): Pagination {
  const pages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    pages
  };
}

// Generate mock blog posts response
export function generateMockBlogPostsResponse(
  page: number = 1,
  limit: number = 12,
  search?: string,
  category?: string,
  tag?: string
) {
  let filteredPosts = [...mockBlogPosts];

  // Filter by search query
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt?.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Filter by category
  if (category) {
    filteredPosts = filteredPosts.filter(post =>
      post.categories?.some(cat => cat.toLowerCase() === category.toLowerCase())
    );
  }

  // Filter by tag
  if (tag) {
    filteredPosts = filteredPosts.filter(post =>
      post.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Sort by published date (newest first)
  filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    pagination: generateMockPagination(page, limit, filteredPosts.length)
  };
}

// Generate mock metadata response
export function generateMockMetadataResponse() {
  return {
    metadata: mockBlogMetadata
  };
}

// Generate mock categories response
export function generateMockCategoriesResponse() {
  return {
    categories: mockCategories
  };
}

// Generate mock tags response
export function generateMockTagsResponse() {
  return {
    tags: mockTags
  };
}

