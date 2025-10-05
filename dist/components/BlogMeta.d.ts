import { BlogPost, AutoBlogifyConfig } from '../types';
export interface BlogMetaProps {
    post: BlogPost;
    config: AutoBlogifyConfig;
    showAuthor?: boolean;
    showDate?: boolean;
    showReadingTime?: boolean;
    showWordCount?: boolean;
    className?: string;
}
export declare function BlogMeta({ post, config, showAuthor, showDate, showReadingTime, showWordCount, className }: BlogMetaProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BlogMeta.d.ts.map