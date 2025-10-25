import { format, parseISO, formatDistanceToNow } from 'date-fns';

/**
 * Format date string for display
 */
export function formatDate(dateString: string, language: string = 'en'): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.warn('Invalid date format:', dateString);
    return dateString;
  }
}

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export function formatRelativeDate(dateString: string, language: string = 'en'): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.warn('Invalid date format:', dateString);
    return dateString;
  }
}

/**
 * Format reading time
 */
export function formatReadingTime(minutes: number, language: string = 'en'): string {
  if (minutes < 1) {
    return language === 'en' ? 'Less than 1 min read' : '< 1 min de lecture';
  }
  
  if (language === 'en') {
    return `${minutes} min read`;
  }
  
  // Add more language support as needed
  return `${minutes} min de lecture`;
}

/**
 * Format word count
 */
export function formatWordCount(words: number, language: string = 'en'): string {
  if (language === 'en') {
    return `${words.toLocaleString()} words`;
  }
  
  return `${words.toLocaleString()} mots`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 150): string {
  const stripped = stripHtml(content);
  return truncateText(stripped, maxLength);
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format number with appropriate suffixes (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Get reading time estimate from content
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 225): number {
  const text = stripHtml(content);
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get word count from content
 */
export function getWordCount(content: string): number {
  const text = stripHtml(content);
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Format categories for display
 */
export function formatCategories(categories: string[], maxDisplay: number = 3): {
  displayed: string[];
  remaining: number;
} {
  if (categories.length <= maxDisplay) {
    return { displayed: categories, remaining: 0 };
  }
  
  return {
    displayed: categories.slice(0, maxDisplay),
    remaining: categories.length - maxDisplay
  };
}

/**
 * Format tags for display
 */
export function formatTags(tags: string[], maxDisplay: number = 5): {
  displayed: string[];
  remaining: number;
} {
  if (tags.length <= maxDisplay) {
    return { displayed: tags, remaining: 0 };
  }
  
  return {
    displayed: tags.slice(0, maxDisplay),
    remaining: tags.length - maxDisplay
  };
}

/**
 * Get first paragraph from content
 */
export function getFirstParagraph(content: string): string {
  const stripped = stripHtml(content);
  const paragraphs = stripped.split('\n\n');
  return paragraphs[0] || '';
}

/**
 * Format URL for display (remove protocol, www, etc.)
 */
export function formatUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '') + urlObj.pathname;
  } catch {
    return url;
  }
}

/**
 * Generate color from string (for avatars, tags, etc.)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Check if string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
