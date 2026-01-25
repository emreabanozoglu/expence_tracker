'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Download, LogOut, X, Menu } from 'lucide-react';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import styles from './MobileNav.module.css';

interface MobileNavProps {
    onSettingsClick: () => void;
    onExportClick: () => void;
    onSignOutClick: () => void;
    showExport?: boolean;
}

export default function MobileNav({
    onSettingsClick,
    onExportClick,
    onSignOutClick,
    showExport = false,
}: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

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
            <button
                className={styles.hamburger}
                onClick={handleToggle}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className={styles.backdrop}
                    onClick={handleClose}
                    aria-hidden="true"
                />
            )}

            {/* Navigation Drawer */}
            <nav className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.drawerHeader}>
                    <h2 className={styles.drawerTitle}>Menu</h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.drawerContent}>
                    <div className={styles.navItem}>
                        <Button
                            variant="ghost"
                            onClick={handleSettingsClick}
                            className={styles.navButton}
                        >
                            <Settings size={20} />
                            Settings
                        </Button>
                    </div>

                    <div className={styles.navItem}>
                        <div className={styles.themeToggleWrapper}>
                            <span className={styles.themeLabel}>Theme</span>
                            <ThemeToggle />
                        </div>
                    </div>

                    {showExport && (
                        <div className={styles.navItem}>
                            <Button
                                variant="ghost"
                                onClick={handleExportClick}
                                className={styles.navButton}
                            >
                                <Download size={20} />
                                Export
                            </Button>
                        </div>
                    )}

                    <div className={styles.navItem}>
                        <Button
                            variant="ghost"
                            onClick={handleSignOutClick}
                            className={styles.navButton}
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
