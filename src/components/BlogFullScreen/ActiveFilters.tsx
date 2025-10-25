import React from 'react';

interface ActiveFiltersProps {
  currentCategory?: string;
  currentTag?: string;
  currentSearch?: string;
  onRemoveCategory: () => void;
  onRemoveTag: () => void;
  onRemoveSearch: () => void;
}

export const ActiveFilters = React.memo(function ActiveFilters({
  currentCategory,
  currentTag,
  currentSearch,
  onRemoveCategory,
  onRemoveTag,
  onRemoveSearch
}: ActiveFiltersProps) {
  // Don't render if no active filters
  if (!currentCategory && !currentTag && !currentSearch) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-blue-800">Active filters:</span>
        
        {currentCategory && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Category: {currentCategory}
            <button
              onClick={onRemoveCategory}
              className="ml-2 text-blue-600 hover:text-blue-800"
              aria-label={`Remove category filter: ${currentCategory}`}
            >
              ×
            </button>
          </span>
        )}
        
        {currentTag && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Tag: {currentTag}
            <button
              onClick={onRemoveTag}
              className="ml-2 text-blue-600 hover:text-blue-800"
              aria-label={`Remove tag filter: ${currentTag}`}
            >
              ×
            </button>
          </span>
        )}
        
        {currentSearch && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Search: "{currentSearch}"
            <button
              onClick={onRemoveSearch}
              className="ml-2 text-blue-600 hover:text-blue-800"
              aria-label={`Remove search filter: ${currentSearch}`}
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
});
