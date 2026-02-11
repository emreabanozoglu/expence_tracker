import React from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
    return (
        <div className="tooltip tooltip-top inline-flex items-center cursor-help" data-tip={content}>
            {children}
        </div>
    );
}
