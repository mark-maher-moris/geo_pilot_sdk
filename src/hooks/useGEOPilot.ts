import { createContext, useContext } from 'react';
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

// Create context with proper default values for React 18
export const GEOPilotContext = createContext<GEOPilotContextValue | null>(null);

export function useGEOPilot(): GEOPilotContextValue {
  const context = useContext(GEOPilotContext);
  
  if (!context) {
    throw new Error('useGEOPilot must be used within a GEOPilotProvider');
  }
  
  return context;
}
