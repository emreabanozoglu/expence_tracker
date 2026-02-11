'use client';

import React from 'react';
import { Settings, PieChart, Tag, RefreshCw, Download, LogOut, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

interface SettingsSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TABS = [
    { id: 'general', label: 'General', icon: <Settings size={18} /> },
    { id: 'budget', label: 'Budget', icon: <PieChart size={18} /> },
    { id: 'categories', label: 'Categories', icon: <Tag size={18} /> },
    { id: 'recurring', label: 'Recurring', icon: <RefreshCw size={18} /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard size={18} /> },
    { id: 'export', label: 'Export Data', icon: <Download size={18} /> },
];

export default function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
    const { signOut } = useAuth();

    return (
        <nav className="flex flex-col gap-2 w-full">
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        className={`
                            group flex items-center gap-3 w-full text-left transition-all duration-200 rounded-xl
                            p-4 md:px-4 md:py-3 md:rounded-lg
                            border border-base-200 md:border-transparent
                            bg-base-100 md:bg-transparent
                            justify-between md:justify-start
                            ${isActive
                                ? 'border-primary md:bg-primary/10 text-primary font-semibold shadow-sm md:shadow-none'
                                : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'
                            }
                        `}
                        onClick={() => onTabChange(tab.id)}
                        data-testid={`settings-tab-${tab.id}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={isActive ? 'text-primary' : ''}>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </div>
                        <ChevronRight size={16} className={`md:hidden text-base-content/40 ${isActive ? 'text-primary' : ''}`} />
                    </button>
                );
            })}

            <div className="h-px bg-base-200 my-2 hidden md:block" />

            <button
                className={`
                    group flex items-center gap-3 w-full text-left transition-all duration-200 rounded-xl
                    p-4 md:px-4 md:py-3 md:rounded-lg
                    border border-base-200 md:border-transparent
                    bg-base-100 md:bg-transparent
                    justify-between md:justify-start
                    text-error/80 hover:text-error hover:bg-error/10
                `}
                onClick={() => signOut()}
                data-testid="settings-signout"
            >
                <div className="flex items-center gap-3">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </div>
            </button>
        </nav>
    );
}
