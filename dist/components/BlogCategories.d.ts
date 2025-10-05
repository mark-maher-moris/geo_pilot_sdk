import { AutoBlogifyConfig } from '../types';
export interface BlogCategoriesProps {
    config: AutoBlogifyConfig;
    onCategoryClick?: (category: string) => void;
    showPostCount?: boolean;
    maxCategories?: number;
    className?: string;
}
export declare function BlogCategories({ config, onCategoryClick, showPostCount, maxCategories, className }: BlogCategoriesProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogCategories.d.ts.map