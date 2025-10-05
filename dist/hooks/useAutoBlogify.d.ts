import { GEOPilotAPI } from '../services/api';
import { GEOPilotConfig, BlogDesignConfig } from '../types';
export interface GEOPilotContextValue {
    api: GEOPilotAPI | null;
    apiReady: boolean;
    config: GEOPilotConfig | null;
    updateConfig: (newConfig: Partial<GEOPilotConfig>) => void;
    design?: BlogDesignConfig | null;
    designLoading?: boolean;
    designError?: string | null;
}
export declare const GEOPilotContext: import("react").Context<GEOPilotContextValue>;
export declare function useGEOPilot(): GEOPilotContextValue;
//# sourceMappingURL=useAutoBlogify.d.ts.map