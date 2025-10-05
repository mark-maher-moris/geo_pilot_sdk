import { BlogPost, AutoBlogifyConfig } from '../types';
export interface SEOHeadProps {
    post?: BlogPost;
    config: AutoBlogifyConfig;
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    structuredData?: any[];
    metaTags?: any;
    enableAdvancedSEO?: boolean;
    enablePerformanceOptimizations?: boolean;
}
export declare function SEOHead({ post, config, title, description, image, url, type, structuredData, metaTags, enableAdvancedSEO, enablePerformanceOptimizations }: SEOHeadProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SEOHead.d.ts.map