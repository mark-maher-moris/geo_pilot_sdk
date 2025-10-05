import * as React from 'react';

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ErrorMessage({ 
  message, 
  onRetry, 
  className = '',
  style 
}: ErrorMessageProps) {
  return (
    <div 
      className={`auto-blogify-error-message bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}
      style={style}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-red-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Something went wrong
          </h3>
          <p className="mt-2 text-sm text-red-700">
            {message}
          </p>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
