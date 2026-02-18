'use client';

import React from 'react';
import { LayoutDashboard, Target, Plus, Settings, Download } from 'lucide-react';
import { TouchButton } from './TouchButton';
import Link from 'next/link';

interface BottomNavProps {
    activePage?: 'dashboard' | 'settings';
    onAddClick?: () => void;
    onBudgetClick?: () => void;
    onExportClick?: () => void;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    href?: string;
}

function NavItem({ icon, label, isActive, onClick, href }: NavItemProps) {
    const content = (
        <span className="flex flex-col items-center gap-0.5">
            <span className="transition-transform duration-150" style={{ transform: isActive ? 'scale(1.15)' : 'scale(1)' }}>
                {icon}
            </span>
            <span className="text-[10px] font-medium leading-none" style={{ color: isActive ? 'var(--color-primary)' : undefined }}>
                {label}
            </span>
        </span>
    );

    const baseClass = `flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors duration-150 ${isActive ? 'text-primary' : 'text-base-content/50 hover:text-base-content/80'
        }`;

    if (href) {
        return (
            <Link href={href} className={baseClass}>
                {content}
            </Link>
        );
    }

    return (
        <TouchButton className={`${baseClass} bg-transparent border-none outline-none`} onTap={onClick}>
            {content}
        </TouchButton>
    );
}

export default function BottomNav({ activePage, onAddClick, onBudgetClick, onExportClick }: BottomNavProps) {
    return (
        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-[900] flex items-stretch"
            style={{
                background: 'var(--card-bg)',
                borderTop: '1px solid var(--border)',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
                height: 'calc(60px + env(safe-area-inset-bottom))',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            aria-label="Mobile navigation"
        >
            {/* 1 — Dashboard */}
            <NavItem
                href="/dashboard"
                icon={<LayoutDashboard size={22} />}
                label="Dashboard"
                isActive={activePage === 'dashboard'}
            />

            {/* 2 — Budget */}
            <NavItem
                icon={<Target size={22} />}
                label="Budget"
                onClick={onBudgetClick}
            />

            {/* 3 — Add (center) */}
            <div className="flex items-center justify-center flex-1">
                <TouchButton
                    className="flex items-center justify-center rounded-full border-none outline-none cursor-pointer active:scale-90 transition-transform duration-150"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-focus, var(--color-primary)))',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                        width: '48px',
                        height: '48px',
                    }}
                    onTap={onAddClick}
                    aria-label="Add Transaction"
                    data-testid="bottom-nav-add-button"
                >
                    <Plus size={24} className="text-primary-content" />
                </TouchButton>
            </div>

            {/* 4 — Export */}
            <NavItem
                icon={<Download size={22} />}
                label="Export"
                onClick={onExportClick}
            />

            {/* 5 — Settings */}
            <NavItem
                href="/settings"
                icon={<Settings size={22} />}
                label="Settings"
                isActive={activePage === 'settings'}
            />
        </nav>
    );
}

