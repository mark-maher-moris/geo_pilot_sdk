import React from 'react';
import { useState, useEffect } from 'react';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { GEOPilotConfig } from '../types';

export interface BlogCategoriesProps {
  config: GEOPilotConfig;
  onCategoryClick?: (category: string) => void;
  showPostCount?: boolean;
  maxCategories?: number;
  className?: string;
}

export function BlogCategories({
  config,
  onCategoryClick,
  showPostCount = false,
  maxCategories = 10,
  className = ''
}: BlogCategoriesProps) {
  const { api, apiReady } = useGEOPilot();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!api || !apiReady) {
        return; // Wait for API to be initialized
      }
      
      try {
        setLoading(true);
        setError(null);
        const response = await api.getBlogCategories();
        setCategories(response.categories.slice(0, maxCategories));
      } catch (err) {
        setError('Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [api, apiReady, maxCategories]);

  if (loading) {
    return (
      <div className={`blog-categories loading ${className}`}>
        <div className="loading-spinner"></div>
        <span>Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`blog-categories error ${className}`}>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={`blog-categories empty ${className}`}>
        <p>No categories found.</p>
      </div>
    );
  }

  return (
    <div className={`blog-categories ${className}`}>
      <ul className="categories-list space-y-2">
        {categories.map((category) => (
          <li key={category} className="category-item">
            <button
              onClick={() => onCategoryClick?.(category)}
              className="category-link w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex justify-between items-center"
            >
              <span className="font-medium text-gray-700">{category}</span>
              {showPostCount && (
                <span className="post-count text-sm text-gray-500">(0)</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
