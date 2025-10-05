import { AutoBlogifyAPI } from '../services/api';
import { AutoBlogifyConfig, BlogDesignConfig } from '../types';
export interface AutoBlogifyContextValue {
    api: AutoBlogifyAPI | null;
    apiReady: boolean;
    config: AutoBlogifyConfig | null;
    updateConfig: (newConfig: Partial<AutoBlogifyConfig>) => void;
    design?: BlogDesignConfig | null;
    designLoading?: boolean;
    designError?: string | null;
}
export declare const AutoBlogifyContext: import("react").Context<AutoBlogifyContextValue>;
export declare function useAutoBlogify(): AutoBlogifyContextValue;
//# sourceMappingURL=useAutoBlogify.d.ts.map