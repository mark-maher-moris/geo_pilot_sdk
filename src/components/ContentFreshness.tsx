import * as React from 'react';
import { useMemo } from 'react';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { applyDesignStyles } from '../utils/themeUtils';

export interface ContentFreshnessProps {
  publishedAt: string;
  updatedAt?: string;
  showIndicator?: boolean;
  showLastUpdated?: boolean;
  freshnessThreshold?: number; // Days
  className?: string;
  style?: React.CSSProperties;
}

export function ContentFreshness({
  publishedAt,
  updatedAt,
  showIndicator = true,
  showLastUpdated = true,
  freshnessThreshold = 30, // 30 days
  className = '',
  style
}: ContentFreshnessProps) {
  const { design } = useGEOPilot();

  const freshnessData = useMemo(() => {
    const now = new Date();
    const published = new Date(publishedAt);
    const updated = updatedAt ? new Date(updatedAt) : published;
    
    const daysSincePublished = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceUpdated = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    
    const isFresh = daysSinceUpdated <= freshnessThreshold;
    const isRecentlyUpdated = updatedAt && updated.getTime() > published.getTime();
    
    return {
      daysSincePublished,
      daysSinceUpdated,
      isFresh,
      isRecentlyUpdated,
      published,
      updated
    };
  }, [publishedAt, updatedAt, freshnessThreshold]);

  const containerClasses = useMemo(() => {
    return `
      auto-blogify-content-freshness
      flex
      items-center
      space-x-2
      text-sm
      ${className}
    `.trim().replace(/\s+/g, ' ');
  }, [className]);

  const containerStyles = useMemo(() => {
    return applyDesignStyles(design, style);
  }, [design, style]);

  const getFreshnessIndicator = () => {
    if (!showIndicator) return null;

    const { isFresh, isRecentlyUpdated } = freshnessData;
    
    let indicatorColor = '#10B981'; // Green for fresh
    let indicatorText = 'Fresh';
    let indicatorIcon = '🟢';

    if (!isFresh) {
      indicatorColor = '#F59E0B'; // Amber for stale
      indicatorText = 'Stale';
      indicatorIcon = '🟡';
    }

    if (isRecentlyUpdated) {
      indicatorColor = '#3B82F6'; // Blue for recently updated
      indicatorText = 'Updated';
      indicatorIcon = '🔵';
    }

    return (
      <span
        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${indicatorColor}20`,
          color: indicatorColor,
          border: `1px solid ${indicatorColor}40`
        }}
        title={`Content ${indicatorText.toLowerCase()}`}
      >
        <span className="mr-1" aria-hidden="true">{indicatorIcon}</span>
        {indicatorText}
      </span>
    );
  };

  const getLastUpdatedText = () => {
    if (!showLastUpdated) return null;

    const { daysSinceUpdated, isRecentlyUpdated, updated } = freshnessData;
    
    if (isRecentlyUpdated) {
      if (daysSinceUpdated === 0) {
        return 'Updated today';
      } else if (daysSinceUpdated === 1) {
        return 'Updated yesterday';
      } else if (daysSinceUpdated < 7) {
        return `Updated ${daysSinceUpdated} days ago`;
      } else if (daysSinceUpdated < 30) {
        const weeks = Math.floor(daysSinceUpdated / 7);
        return `Updated ${weeks} week${weeks > 1 ? 's' : ''} ago`;
      } else {
        return `Updated ${updated.toLocaleDateString()}`;
      }
    }

    return null;
  };

  const getAgeText = () => {
    const { daysSincePublished } = freshnessData;
    
    if (daysSincePublished === 0) {
      return 'Published today';
    } else if (daysSincePublished === 1) {
      return 'Published yesterday';
    } else if (daysSincePublished < 7) {
      return `Published ${daysSincePublished} days ago`;
    } else if (daysSincePublished < 30) {
      const weeks = Math.floor(daysSincePublished / 7);
      return `Published ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (daysSincePublished < 365) {
      const months = Math.floor(daysSincePublished / 30);
      return `Published ${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(daysSincePublished / 365);
      return `Published ${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className={containerClasses} style={containerStyles}>
      {/* Freshness Indicator */}
      {getFreshnessIndicator()}
      
      {/* Age Information */}
      <span className="text-gray-600">
        {getAgeText()}
      </span>
      
      {/* Last Updated Information */}
      {getLastUpdatedText() && (
        <>
          <span className="text-gray-400" aria-hidden="true">•</span>
          <span className="text-gray-600">
            {getLastUpdatedText()}
          </span>
        </>
      )}
    </div>
  );
}
