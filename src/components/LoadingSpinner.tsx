import * as React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = '#3B82F6',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`auto-blogify-loading-spinner flex justify-center items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]}`}
        style={{ borderTopColor: color }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
