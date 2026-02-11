// Reusable Modal Component

'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    // Don't render anything if not open, but ideally DaisyUI uses opacity transitions.
    // However, to keep same behavior as before (mounting/unmounting), we can return null.
    // Or we can keep it mounted and just toggle classes if we want animations.
    // The previous implementation used `if (!isOpen) return null;` AND had animations defined in CSS.
    // If we return null, we lose exit animations unless we use AnimatePresence or similar.
    // The previous CSS had: `animation: fadeIn` on overlay and `slideUp` on modal.
    // Since we are replacing CSS modules, and `isOpen` controls rendering, we might lose exit animations anyway 
    // without a transition library, but entry animations will work if we use `modal-open`.

    if (!isOpen) return null;

    // Map sizes
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
    };

    return (
        <div className="modal modal-open modal-middle bg-black/60 backdrop-blur-sm z-[2000]" onClick={onClose}>
            <div
                className={`modal-box relative ${sizeClasses[size]} bg-[var(--card-bg)] p-4 md:p-6 max-h-[85vh] overflow-y-auto !overflow-x-visible`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <h3 className="font-bold text-xl mb-4 pr-8">{title}</h3>

                <div className="pt-2">
                    {children}
                </div>
            </div>
        </div>
    );
}
