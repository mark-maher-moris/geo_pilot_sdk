import React from 'react';
import { useState, useEffect } from 'react';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { GEOPilotConfig } from '../types';

export interface BlogTagsProps {
  config: GEOPilotConfig;
  onTagClick?: (tag: string) => void;
  showPostCount?: boolean;
  maxTags?: number;
  style?: 'pills' | 'list' | 'cloud';
  className?: string;
}

export function BlogTags({
  config,
  onTagClick,
  showPostCount = false,
  maxTags = 20,
  style = 'pills',
  className = ''
}: BlogTagsProps) {
  const { api, apiReady } = useGEOPilot();
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      if (!api || !apiReady) {
        return; // Wait for API to be initialized
      }
      
      try {
        setLoading(true);
        setError(null);
        const response = await api.getBlogTags();
        setTags(response.tags.slice(0, maxTags));
      } catch (err) {
        setError('Failed to fetch tags');
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [api, apiReady, maxTags]);

  if (loading) {
    return (
      <div className={`blog-tags loading ${className}`}>
        <div className="loading-spinner"></div>
        <span>Loading tags...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`blog-tags error ${className}`}>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className={`blog-tags empty ${className}`}>
        <p>No tags found.</p>
      </div>
    );
  }

  const getTagStyle = (tag: string, index: number) => {
    if (style === 'cloud') {
      const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg'];
      return sizes[index % sizes.length];
    }
    return '';
  };

  return (
    <div className={`blog-tags ${style} ${className}`}>
      {style === 'list' ? (
        <ul className="tags-list space-y-2">
          {tags.map((tag) => (
            <li key={tag} className="tag-item">
              <button
                onClick={() => onTagClick?.(tag)}
                className="tag-link w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex justify-between items-center"
              >
                <span className="font-medium text-gray-700">#{tag}</span>
                {showPostCount && (
                  <span className="post-count text-sm text-gray-500">(0)</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="tags-container flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className={`tag-pill px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full transition-colors ${getTagStyle(tag, index)}`}
            >
              #{tag}
              {showPostCount && (
                <span className="post-count ml-1 text-xs">(0)</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
