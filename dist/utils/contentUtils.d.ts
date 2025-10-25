import { TableOfContentsItem } from '../components/BlogTableOfContents';
/**
 * Extract headings from HTML content and generate table of contents
 */
export declare function extractHeadingsFromContent(content: string): TableOfContentsItem[];
/**
 * Add IDs to headings in HTML content if they don't exist
 */
export declare function addIdsToHeadings(content: string): string;
/**
 * Parse content into sections based on headings
 */
export declare function parseContentIntoSections(content: string): Array<{
    id: string;
    title: string;
    level: number;
    content: string;
}>;
/**
 * Generate structured content with proper heading hierarchy
 */
export declare function generateStructuredContent(content: string, options?: {
    addIds?: boolean;
    generateTOC?: boolean;
    maxHeadingLevel?: number;
}): {
    content: string;
    toc: TableOfContentsItem[];
    sections: Array<{
        id: string;
        title: string;
        level: number;
        content: string;
    }>;
};
//# sourceMappingURL=contentUtils.d.ts.map