import { GEOPilotConfig } from '../types';
export interface BlogTagsProps {
    config: GEOPilotConfig;
    onTagClick?: (tag: string) => void;
    showPostCount?: boolean;
    maxTags?: number;
    style?: 'pills' | 'list' | 'cloud';
    className?: string;
}
export declare function BlogTags({ config, onTagClick, showPostCount, maxTags, style, className }: BlogTagsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogTags.d.ts.map