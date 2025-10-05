import { BlogPostProps } from '../types';
export interface BlogPostEnhancedProps extends BlogPostProps {
    websiteName?: string;
    blogHomeUrl?: string;
    mainWebsiteUrl?: string;
    logoUrl?: string;
    navigationItems?: Array<{
        label: string;
        url: string;
    }>;
    showSiteHeader?: boolean;
    showTOC?: boolean;
    showSocialShare?: boolean;
    showConclusionFAQ?: boolean;
    showCTAFooter?: boolean;
    conclusion?: string;
    faqItems?: Array<{
        id: string;
        question: string;
        answer: string;
    }>;
    ctaButtons?: Array<{
        id: string;
        text: string;
        url: string;
        style: 'primary' | 'secondary' | 'outline';
        size: 'sm' | 'md' | 'lg';
    }>;
    footerText?: string;
}
export declare function BlogPostEnhanced({ config, postId, slug, onBack, showRelatedPosts, enableComments, enableSharing, websiteName, blogHomeUrl, mainWebsiteUrl, logoUrl, navigationItems, showSiteHeader, showTOC, showSocialShare, showConclusionFAQ, showCTAFooter, conclusion, faqItems, ctaButtons, footerText, className, style }: BlogPostEnhancedProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogPostEnhanced.d.ts.map