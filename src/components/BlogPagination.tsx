import * as React from 'react';
import { Pagination, GEOPilotConfig } from '../types';

export interface BlogPaginationProps {
  pagination: Pagination;
  config: GEOPilotConfig;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxPages?: number;
  className?: string;
}

export function BlogPagination({
  pagination,
  config,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxPages = 7,
  className = ''
}: BlogPaginationProps) {
  const { page: currentPage, pages: totalPages } = pagination;
  
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    const halfMaxPages = Math.floor(maxPages / 2);
    
    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxPages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPages + 1);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  const theme = config.theme || {};

  const buttonBaseClasses = "px-3 py-2 text-sm font-medium border transition-colors";
  const activeClasses = "bg-blue-500 text-white border-blue-500";
  const inactiveClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
  const disabledClasses = "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed";

  return (
    <nav 
      className={`auto-blogify-blog-pagination flex justify-center ${className}`}
      aria-label="Blog pagination"
    >
      <div className="flex items-center space-x-1">
        {/* First Page */}
        {showFirstLast && currentPage > 1 && pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`${buttonBaseClasses} ${inactiveClasses} rounded-l-md`}
              aria-label="Go to first page"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
          </>
        )}

        {/* Previous Page */}
        {showPrevNext && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${buttonBaseClasses} ${
              currentPage === 1 ? disabledClasses : inactiveClasses
            } ${!showFirstLast || pageNumbers[0] === 1 ? 'rounded-l-md' : ''}`}
            aria-label="Go to previous page"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`${buttonBaseClasses} ${
              pageNum === currentPage ? activeClasses : inactiveClasses
            }`}
            style={pageNum === currentPage ? { 
              backgroundColor: theme.primaryColor || '#3B82F6',
              borderColor: theme.primaryColor || '#3B82F6'
            } : undefined}
            aria-label={`Go to page ${pageNum}`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}

        {/* Next Page */}
        {showPrevNext && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${buttonBaseClasses} ${
              currentPage === totalPages ? disabledClasses : inactiveClasses
            } ${!showFirstLast || pageNumbers[pageNumbers.length - 1] === totalPages ? 'rounded-r-md' : ''}`}
            aria-label="Go to next page"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {/* Last Page */}
        {showFirstLast && currentPage < totalPages && pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`${buttonBaseClasses} ${inactiveClasses} rounded-r-md`}
              aria-label="Go to last page"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Page Info */}
      <div className="ml-4 flex items-center text-sm text-gray-700">
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </nav>
  );
}
