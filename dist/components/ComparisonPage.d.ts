import { AutoBlogifyConfig } from '../types';
export interface ComparisonPageProps {
    config: AutoBlogifyConfig;
    slug: string;
    className?: string;
    style?: any;
    onConversion?: () => void;
}
export interface ComparisonPageData {
    id: string;
    title: string;
    slug: string;
    type: 'comparison' | 'alternative' | 'vs';
    status: 'draft' | 'published' | 'archived';
    hero: {
        title: string;
        subtitle: string;
        description: string;
        ctaText: string;
        ctaUrl: string;
        backgroundImage?: string;
    };
    overview: {
        title: string;
        description: string;
        keyPoints: string[];
    };
    comparison: {
        title: string;
        description: string;
        features: Array<{
            feature: string;
            ourProject: string | boolean;
            competitor: string | boolean;
            advantage: 'ours' | 'theirs' | 'equal';
        }>;
        pricing: {
            title: string;
            ourProject: {
                price: string;
                features: string[];
                ctaText: string;
                ctaUrl: string;
            };
            competitor: {
                price: string;
                features: string[];
            };
        };
    };
    advantages: {
        title: string;
        description: string;
        points: Array<{
            title: string;
            description: string;
            icon?: string;
        }>;
    };
    testimonials: Array<{
        name: string;
        role: string;
        company: string;
        content: string;
        avatar?: string;
        rating: number;
    }>;
    faq: Array<{
        question: string;
        answer: string;
    }>;
    cta: {
        title: string;
        description: string;
        buttonText: string;
        buttonUrl: string;
        secondaryButtonText?: string;
        secondaryButtonUrl?: string;
    };
    competitor: {
        id: string;
        name: string;
        website: string;
        description: string;
        logo?: string;
        category: string;
    };
    project: {
        id: string;
        name: string;
        description: string;
        website: string;
        logo?: string;
    };
}
export declare function ComparisonPage({ config, slug, className, style, onConversion }: ComparisonPageProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ComparisonPage.d.ts.map