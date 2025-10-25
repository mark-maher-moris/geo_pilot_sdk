/**
 * Format date string for display
 */
export declare function formatDate(dateString: string, language?: string): string;
/**
 * Format date as relative time (e.g., "2 days ago")
 */
export declare function formatRelativeDate(dateString: string, language?: string): string;
/**
 * Format reading time
 */
export declare function formatReadingTime(minutes: number, language?: string): string;
/**
 * Format word count
 */
export declare function formatWordCount(words: number, language?: string): string;
/**
 * Truncate text to specified length
 */
export declare function truncateText(text: string, maxLength: number, suffix?: string): string;
/**
 * Strip HTML tags from content
 */
export declare function stripHtml(html: string): string;
/**
 * Generate excerpt from content
 */
export declare function generateExcerpt(content: string, maxLength?: number): string;
/**
 * Slugify text for URLs
 */
export declare function slugify(text: string): string;
/**
 * Capitalize first letter of each word
 */
export declare function titleCase(text: string): string;
/**
 * Format file size
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Format number with appropriate suffixes (K, M, B)
 */
export declare function formatNumber(num: number): string;
/**
 * Get reading time estimate from content
 */
export declare function calculateReadingTime(content: string, wordsPerMinute?: number): number;
/**
 * Get word count from content
 */
export declare function getWordCount(content: string): number;
/**
 * Format categories for display
 */
export declare function formatCategories(categories: string[], maxDisplay?: number): {
    displayed: string[];
    remaining: number;
};
/**
 * Format tags for display
 */
export declare function formatTags(tags: string[], maxDisplay?: number): {
    displayed: string[];
    remaining: number;
};
/**
 * Get first paragraph from content
 */
export declare function getFirstParagraph(content: string): string;
/**
 * Format URL for display (remove protocol, www, etc.)
 */
export declare function formatUrl(url: string): string;
/**
 * Generate color from string (for avatars, tags, etc.)
 */
export declare function stringToColor(str: string): string;
/**
 * Check if string is a valid URL
 */
export declare function isValidUrl(string: string): boolean;
/**
 * Extract domain from URL
 */
export declare function extractDomain(url: string): string;
//# sourceMappingURL=formatters.d.ts.map