"use client";

import React, { useState, useRef, ButtonHTMLAttributes } from 'react';

interface TouchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    onTap?: () => void;
    children: React.ReactNode;
}

/**
 * A button component optimized for touch devices, specifically iOS.
 * It bypasses the standard 300ms delay and "ghost click" behavior by
 * listening for touch events directly.
 */
export const TouchButton: React.FC<TouchButtonProps> = ({
    onTap,
    onClick,
    children,
    className,
    disabled,
    ...props
}) => {
    const [isPressed, setIsPressed] = useState(false);
    const touchStartRef = useRef<{ x: number, y: number, time: number } | null>(null);

    // Handle touch start
    const handleTouchStart = (e: React.TouchEvent) => {
        if (disabled) return;

        setIsPressed(true);
        const touch = e.changedTouches[0];
        touchStartRef.current = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };
    };

    // Handle touch end
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (disabled) return;

        setIsPressed(false);

        if (!touchStartRef.current) return;

        const touch = e.changedTouches[0];
        const dx = Math.abs(touch.clientX - touchStartRef.current.x);
        const dy = Math.abs(touch.clientY - touchStartRef.current.y);
        const dt = Date.now() - touchStartRef.current.time;

        // Reset
        touchStartRef.current = null;

        // If moved less than 10px and duration less than 500ms, consider it a tap
        if (dx < 10 && dy < 10 && dt < 500) {
            // Prevent default to stop the ghost click from firing later
            if (e.cancelable) {
                e.preventDefault();
            }

            // Trigger the handler
            if (onTap) {
                onTap();
            } else if (onClick) {
                // Cast to MouseEvent because the handler expects it, 
                // even though we're calling it from a touch event
                onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
            }
        }
    };

    // Handle touch cancel (e.g. scroll intercept)
    const handleTouchCancel = () => {
        setIsPressed(false);
        touchStartRef.current = null;
    };

    // Fallback for non-touch devices (mouse clicks)
    const handleMouseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;

        if (onClick) {
            onClick(e);
        } else if (onTap) {
            onTap();
        }
    };

    return (
        <button
            {...props}
            disabled={disabled}
            className={className}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onClick={handleMouseClick}
            data-active={isPressed}
            style={{
                // Ensure touch actions like scrolling still work, but no double-tap zoom
                touchAction: 'manipulation',
                // Remove tap highlight on iOS since we handle active state
                WebkitTapHighlightColor: 'transparent',
                // Prevent text selection
                userSelect: 'none',
                WebkitUserSelect: 'none',
                ...props.style
            }}
        >
            {children}
        </button>
    );
};
