// Mobile Navigation Component

import React, { useState, useEffect } from 'react';
import { Settings, Download, LogOut, X, Menu, Target } from 'lucide-react';
import Button from './Button';

import { TouchButton } from './TouchButton';

interface MobileNavProps {
    onSettingsClick: () => void;
    onExportClick: () => void;
    onSignOutClick: () => void;
    onBudgetClick: () => void;
    showExport?: boolean;
}

export default function MobileNav({
    onSettingsClick,
    onExportClick,
    onSignOutClick,
    onBudgetClick,
    showExport = false,
}: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    // ... existing useEffect ...
    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSettingsClick = () => {
        onSettingsClick();
        handleClose();
    };

    const handleBudgetClick = () => {
        onBudgetClick();
        handleClose();
    };

    const handleExportClick = () => {
        onExportClick();
        handleClose();
    };

    const handleSignOutClick = () => {
        onSignOutClick();
        handleClose();
    };

    return (
        <>
            {/* Hamburger Button */}
            <TouchButton
                className="btn btn-ghost btn-square md:hidden"
                onTap={handleToggle}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </TouchButton>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[998] animate-[fadeIn_0.2s_ease-out]"
                    onClick={handleClose}
                    aria-hidden="true"
                />
            )}

            {/* Navigation Drawer */}
            <nav className={`
                fixed top-0 right-0 w-[280px] max-w-[85vw] h-screen bg-base-100 shadow-xl z-[999] transition-transform duration-300 flex flex-col
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex justify-between items-center p-4 border-b border-base-200">
                    <h2 className="text-xl font-bold m-0">Menu</h2>
                    <TouchButton
                        className="btn btn-sm btn-ghost btn-circle"
                        onTap={handleClose}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </TouchButton>
                </div>

                <div className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                    <div className="w-full">
                        <Button
                            variant="ghost"
                            onClick={handleBudgetClick}
                            className="w-full justify-start px-4 text-base min-h-[48px] gap-3"
                        >
                            <Target size={20} />
                            Budget
                        </Button>
                    </div>

                    <div className="w-full">
                        <Button
                            variant="ghost"
                            onClick={handleSettingsClick}
                            className="w-full justify-start px-4 text-base min-h-[48px] gap-3"
                        >
                            <Settings size={20} />
                            Settings
                        </Button>
                    </div>

                    {showExport && (
                        <div className="w-full">
                            <Button
                                variant="ghost"
                                onClick={handleExportClick}
                                className="w-full justify-start px-4 text-base min-h-[48px] gap-3"
                            >
                                <Download size={20} />
                                Export
                            </Button>
                        </div>
                    )}

                    <div className="w-full">
                        <Button
                            variant="ghost"
                            onClick={handleSignOutClick}
                            className="w-full justify-start px-4 text-base min-h-[48px] gap-3"
                            data-testid="mobile-logout-button"
                        >
                            <LogOut size={20} />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </nav>
        </>
    );
}
