import React from 'react';
import { useState, useEffect } from 'react';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { GEOPilotConfig, BlogPost } from '../types';
import { OptimizedImage } from './OptimizedImage';

export interface BlogRelatedPostsProps {
  config: GEOPilotConfig;
  postId: string;
  limit?: number;
  onPostClick?: (post: BlogPost) => void;
  className?: string;
}

export function BlogRelatedPosts({
  config,
  postId,
  limit = 3,
  onPostClick,
  className = ''
}: BlogRelatedPostsProps) {
  const { api } = useGEOPilot();
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getRelatedPosts(postId, limit);
        setRelatedPosts(response.posts);
      } catch (err) {
        setError('Failed to fetch related posts');
        console.error('Error fetching related posts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchRelatedPosts();
    }
  }, [api, postId, limit]);

  if (loading) {
    return (
      <div className={`blog-related-posts loading ${className}`}>
        <div className="loading-spinner"></div>
        <span>Loading related posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`blog-related-posts error ${className}`}>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return (
      <div className={`blog-related-posts empty ${className}`}>
        <p>No related posts found.</p>
      </div>
    );
  }

  return (
    <div className={`blog-related-posts ${className}`}>
      <h3 className="related-posts-title text-xl font-semibold mb-4">Related Posts</h3>
      <div className="related-posts-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedPosts.map((post) => (
          <div key={post.id} className="related-post-item">
            <button
              onClick={() => onPostClick?.(post)}
              className="related-post-link w-full text-left bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
            >
              {post.featuredImage && (
                <div className="related-post-image mb-3">
                  <OptimizedImage
                    src={post.featuredImage}
                    alt={post.title}
                    width={300}
                    height={200}
                    aspectRatio={3/2}
                    loading="lazy"
                    className="post-thumbnail w-full h-32 object-cover rounded"
                    enableResponsive={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="related-post-content">
                <h4 className="related-post-title text-lg font-medium mb-2 line-clamp-2">{post.title}</h4>
                {post.excerpt && (
                  <p className="related-post-excerpt text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="related-post-meta flex items-center text-xs text-gray-500 space-x-3">
                  <span className="post-date">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                  {post.readingTime && (
                    <span className="post-reading-time">
                      {post.readingTime} min read
                    </span>
                  )}
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}