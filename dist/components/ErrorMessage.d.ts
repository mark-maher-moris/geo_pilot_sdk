import React from 'react';
export interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
    style?: React.CSSProperties;
}
export declare function ErrorMessage({ message, onRetry, className, style }: ErrorMessageProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ErrorMessage.d.ts.map