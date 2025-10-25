import React from 'react';

interface BlogFooterProps {
  metadata: any;
  showPoweredBy?: boolean;
}

export const BlogFooter = React.memo(function BlogFooter({ metadata, showPoweredBy = true }: BlogFooterProps) {
  return (
    <footer className="bg-gray-50 border-t w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          {showPoweredBy && <p>Powered by GEO Pilot</p>}
          {metadata && (
            <p className="text-sm mt-2">
              Last updated {new Date().toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
});
