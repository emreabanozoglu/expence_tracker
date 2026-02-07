// Settings Page

'use client';

import React, { useState } from 'react';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

// Components
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import GeneralSettings from '@/components/settings/GeneralSettings';
import BudgetSettings from '@/components/settings/BudgetSettings';
import CategoriesSettings from '@/components/settings/CategoriesSettings';
import RecurringTransactionsList from '@/components/settings/RecurringTransactionsList';
import ExportSettings from '@/components/settings/ExportSettings';
import SubscriptionSettings from '@/components/settings/SubscriptionSettings';

export default function SettingsPage() {
    const { isLoading } = useSettingsContext();
    const [activeTab, setActiveTab] = useState('general');
    const [isMobileListOpen, setIsMobileListOpen] = useState(true);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setIsMobileListOpen(false);
    };

    const handleBackToMenu = () => {
        setIsMobileListOpen(true);
    };

    if (isLoading) {
        return (
            <div className={styles.loading} data-testid="settings-loading">
                <div className={styles.spinner}></div>
                <p>Loading settings...</p>
            </div>
        );
    }

    const renderContent = () => {
        // ... (switch case same as before)
        switch (activeTab) {
            case 'general':
                return <GeneralSettings />;
            case 'budget':
                return <BudgetSettings />;
            case 'categories':
                return <CategoriesSettings />;
            case 'recurring':
                return (
                    <div>
                        <h2 className={styles.sectionTitle}>Recurring Transactions</h2>
                        <RecurringTransactionsList />
                    </div>
                );
            case 'subscription':
                return <SubscriptionSettings />;
            case 'export':
                return <ExportSettings />;
            default:
                return <GeneralSettings />;
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="/" className={styles.backButton}>
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </Link>
                    <h1 className={styles.title}>Settings</h1>
                    <p className={styles.subtitle}>
                        Customize your expense tracker preferences
                    </p>
                </div>
            </header>

            <main className={styles.main}>
                <div className={`${styles.layout} ${isMobileListOpen ? styles.mobileListOpen : styles.mobileDetailOpen}`}>
                    <aside className={styles.sidebar}>
                        <SettingsSidebar activeTab={activeTab} onTabChange={handleTabChange} />
                    </aside>
                    <section className={styles.content}>
                        <button
                            className={styles.mobileBackButton}
                            onClick={handleBackToMenu}
                        >
                            <ArrowLeft size={16} />
                            Back to Settings
                        </button>
                        {renderContent()}
                    </section>
                </div>
            </main>
        </div>
    );
}
