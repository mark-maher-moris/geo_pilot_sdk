import React from 'react';
import { useMemo } from 'react';
import { useGEOPilot } from '../hooks/useGEOPilot';
import { applyDesignStyles } from '../utils/themeUtils';

export interface BlogSocialShareProps {
  url: string;
  title: string;
  description?: string;
  platforms?: ('twitter' | 'facebook' | 'linkedin' | 'email')[];
  position?: 'top' | 'bottom' | 'floating' | 'inline';
  className?: string;
  style?: React.CSSProperties;
}

export function BlogSocialShare({
  url,
  title,
  description = '',
  platforms = ['twitter', 'facebook', 'linkedin'],
  position = 'inline',
  className = '',
  style
}: BlogSocialShareProps) {
  const { design } = useGEOPilot();

  const containerClasses = useMemo(() => {
    const baseClasses = 'auto-blogify-social-share';
    
    const positionClasses = {
      top: 'mb-6',
      bottom: 'mt-6',
      floating: 'fixed right-4 top-1/2 transform -translate-y-1/2 z-50',
      inline: 'my-6'
    };

    return `${baseClasses} ${positionClasses[position]} ${className}`.trim().replace(/\s+/g, ' ');
  }, [position, className]);

  const containerStyles = useMemo(() => {
    return applyDesignStyles(design, style);
  }, [design, style]);

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    email: `mailto:?subject=${shareTitle}&body=${shareDescription}%0A%0A${shareUrl}`
  };

  const platformIcons = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  };

  const platformColors = {
    twitter: '#1DA1F2',
    facebook: '#4267B2',
    linkedin: '#0077B5',
    email: '#6B7280'
  };

  const handleShare = (platform: string) => {
    const shareWindow = window.open(
      shareLinks[platform as keyof typeof shareLinks],
      'share',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
    
    if (shareWindow) {
      shareWindow.focus();
    }
  };

  if (position === 'floating') {
    return (
      <div className={containerClasses} style={containerStyles}>
        <div className="flex flex-col space-y-3">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: platformColors[platform] }}
              aria-label={`Share on ${platform}`}
            >
              {platformIcons[platform]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses} style={containerStyles}>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Share this article:</span>
        <div className="flex space-x-3">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
              style={{ backgroundColor: platformColors[platform] }}
              aria-label={`Share on ${platform}`}
            >
              {platformIcons[platform]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
