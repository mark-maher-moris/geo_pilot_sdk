import { createContext, useContext } from 'react';
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

export const AutoBlogifyContext = createContext<AutoBlogifyContextValue>({
  api: null,
  apiReady: false,
  config: null,
  updateConfig: () => {}
});

export function useAutoBlogify(): AutoBlogifyContextValue {
  const context = useContext(AutoBlogifyContext);
  
  if (!context) {
    throw new Error('useAutoBlogify must be used within an AutoBlogifyProvider');
  }
  
  return context;
}
