'use client';

import React from 'react';
import { Settings, PieChart, Tag, RefreshCw, Download } from 'lucide-react';
import styles from './SettingsSidebar.module.css';

interface SettingsSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TABS = [
    { id: 'general', label: 'General', icon: <Settings size={18} /> },
    { id: 'budget', label: 'Budget', icon: <PieChart size={18} /> },
    { id: 'categories', label: 'Categories', icon: <Tag size={18} /> },
    { id: 'recurring', label: 'Recurring', icon: <RefreshCw size={18} /> },
    { id: 'export', label: 'Export Data', icon: <Download size={18} /> },
];

export default function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
    return (
        <nav className={styles.nav}>
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    data-testid={`settings-tab-${tab.id}`}
                >
                    <span className={styles.icon}>{tab.icon}</span>
                    <span className={styles.label}>{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}
