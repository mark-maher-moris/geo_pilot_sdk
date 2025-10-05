import { AutoBlogifyConfig, BlogDesignConfig } from '../types';
/**
 * Merges static theme configuration with dynamic design configuration
 * Dynamic design takes precedence over static theme
 */
export declare function mergeThemeConfig(staticConfig: AutoBlogifyConfig, dynamicDesign?: BlogDesignConfig | null): AutoBlogifyConfig;
/**
 * Gets CSS custom properties from design configuration
 */
export declare function getCSSVariables(design?: BlogDesignConfig | null): Record<string, string>;
/**
 * Gets font family CSS from typography configuration
 */
export declare function getFontFamilyCSS(design?: BlogDesignConfig | null): string;
/**
 * Gets heading font family CSS from typography configuration
 */
export declare function getHeadingFontFamilyCSS(design?: BlogDesignConfig | null): string;
/**
 * Gets body font family CSS from typography configuration
 */
export declare function getBodyFontFamilyCSS(design?: BlogDesignConfig | null): string;
/**
 * Gets responsive layout classes based on design configuration
 */
export declare function getLayoutClasses(design?: BlogDesignConfig | null): string;
/**
 * Gets component visibility settings
 */
export declare function getComponentSettings(design?: BlogDesignConfig | null, component?: 'blogCard' | 'blogPost'): {
    showAuthor: any;
    showDate: any;
    showReadingTime: any;
    showCategories: any;
    showTags: any;
    showExcerpt: any;
    showFeaturedImage: any;
    showShareButtons: boolean;
    showRelatedPosts: boolean;
} | {
    showAuthor: any;
    showDate: any;
    showReadingTime: any;
    showCategories: boolean;
    showTags: boolean;
    showExcerpt: boolean;
    showFeaturedImage: boolean;
    showShareButtons: any;
    showRelatedPosts: any;
};
/**
 * Applies design configuration to a component's style
 */
export declare function applyDesignStyles(design?: BlogDesignConfig | null, baseStyles?: React.CSSProperties): React.CSSProperties;
/**
 * Applies heading font styles from design configuration
 */
export declare function applyHeadingFontStyles(design?: BlogDesignConfig | null, baseStyles?: React.CSSProperties): React.CSSProperties;
/**
 * Applies body font styles from design configuration
 */
export declare function applyBodyFontStyles(design?: BlogDesignConfig | null, baseStyles?: React.CSSProperties): React.CSSProperties;
//# sourceMappingURL=themeUtils.d.ts.map