import { BlogPost, AutoBlogifyConfig } from '../types';
export interface SEOMetaTags {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    ogType: string;
    ogSiteName: string;
    ogLocale: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    twitterSite: string;
    twitterCreator: string;
    articleAuthor: string;
    articlePublishedTime: string;
    articleModifiedTime: string;
    articleSection: string;
    articleTag: string[];
    robots: string;
    viewport: string;
    themeColor: string;
    msapplicationTileColor: string;
    appleMobileWebAppTitle: string;
    appleMobileWebAppCapable: string;
    appleMobileWebAppStatusBarStyle: string;
}
export interface SEOData {
    metaTags: SEOMetaTags;
    structuredData: any[];
    loading: boolean;
    error: string | null;
}
export declare function useSEO(config: AutoBlogifyConfig, post?: BlogPost, type?: 'blog' | 'post'): SEOData;
export declare function useSEOAnalysis(config: AutoBlogifyConfig, post?: BlogPost): {
    analysis: any;
    loading: boolean;
    error: string;
    refetch: () => Promise<void>;
};
//# sourceMappingURL=useSEO.d.ts.map