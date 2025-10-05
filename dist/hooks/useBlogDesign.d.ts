import { BlogDesignConfig } from '../types';
export interface UseBlogDesignResult {
    design: BlogDesignConfig | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateDesign: (updates: Partial<BlogDesignConfig>) => void;
}
export declare function useBlogDesign(): UseBlogDesignResult;
//# sourceMappingURL=useBlogDesign.d.ts.map