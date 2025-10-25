import * as React from 'react';
export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}
export interface BlogConclusionFAQProps {
    conclusion?: string;
    faqItems?: FAQItem[];
    title?: string;
    className?: string;
    style?: React.CSSProperties;
}
export declare function BlogConclusionFAQ({ conclusion, faqItems, title, className, style }: BlogConclusionFAQProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogConclusionFAQ.d.ts.map