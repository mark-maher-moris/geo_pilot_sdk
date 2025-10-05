import { TableOfContentsItem } from '../components/BlogTableOfContents';

/**
 * Extract headings from HTML content and generate table of contents
 */
export function extractHeadingsFromContent(content: string): TableOfContentsItem[] {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
  const headings: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const title = match[3].replace(/<[^>]*>/g, ''); // Remove HTML tags

    headings.push({
      id,
      title,
      level
    });
  }

  return headings;
}

/**
 * Add IDs to headings in HTML content if they don't exist
 */
export function addIdsToHeadings(content: string): string {
  const headingRegex = /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/gi;
  
  return content.replace(headingRegex, (match, level, attributes, title) => {
    // Check if ID already exists
    if (attributes.includes('id=')) {
      return match;
    }

    // Generate ID from title
    const id = title
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();

    return `<h${level}${attributes} id="${id}">${title}</h${level}>`;
  });
}

/**
 * Parse content into sections based on headings
 */
export function parseContentIntoSections(content: string): Array<{
  id: string;
  title: string;
  level: number;
  content: string;
}> {
  const sections: Array<{
    id: string;
    title: string;
    level: number;
    content: string;
  }> = [];

  // First, add IDs to headings if they don't exist
  const contentWithIds = addIdsToHeadings(content);
  
  // Split content by headings
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
  const parts = contentWithIds.split(headingRegex);

  for (let i = 0; i < parts.length; i += 4) {
    if (parts[i + 1] && parts[i + 2] && parts[i + 3]) {
      const level = parseInt(parts[i + 1]);
      const id = parts[i + 2];
      const title = parts[i + 3].replace(/<[^>]*>/g, '');
      const sectionContent = parts[i + 4] || '';

      sections.push({
        id,
        title,
        level,
        content: sectionContent.trim()
      });
    }
  }

  return sections;
}

/**
 * Generate structured content with proper heading hierarchy
 */
export function generateStructuredContent(
  content: string,
  options: {
    addIds?: boolean;
    generateTOC?: boolean;
    maxHeadingLevel?: number;
  } = {}
): {
  content: string;
  toc: TableOfContentsItem[];
  sections: Array<{
    id: string;
    title: string;
    level: number;
    content: string;
  }>;
} {
  const { addIds = true, generateTOC = true, maxHeadingLevel = 6 } = options;

  let processedContent = content;
  
  if (addIds) {
    processedContent = addIdsToHeadings(content);
  }

  const toc = generateTOC ? extractHeadingsFromContent(processedContent) : [];
  const sections = parseContentIntoSections(processedContent);

  return {
    content: processedContent,
    toc,
    sections
  };
}
