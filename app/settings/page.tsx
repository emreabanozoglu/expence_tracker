// Settings Page

'use client';

import React, { useState } from 'react';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BottomNav from '@/components/ui/BottomNav';

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
            <div className="flex flex-col items-center justify-center min-h-screen gap-6" data-testid="settings-loading">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-base-content/60 font-medium">Loading settings...</p>
            </div>
        );
    }

    const renderContent = () => {
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
                        <h2 className="text-xl font-bold mb-6 text-base-content">Recurring Transactions</h2>
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
        <div className="min-h-screen bg-base-100 flex flex-col">
            <header className="bg-base-100 border-b border-base-200 py-8">
                <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
                    <Link href="/" className="inline-flex items-center gap-2 text-base-content/60 text-sm font-medium mb-4 hover:text-primary transition-colors">
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold mb-2 text-base-content">Settings</h1>
                    <p className="text-base-content/60 text-base m-0">
                        Customize your expense tracker preferences
                    </p>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                    <aside className={`w-full md:w-60 shrink-0 md:sticky md:top-8 ${isMobileListOpen ? 'block' : 'hidden md:block'}`}>
                        <SettingsSidebar activeTab={activeTab} onTabChange={handleTabChange} />
                    </aside>
                    <section className={`flex-1 min-w-0 animate-fade-in ${!isMobileListOpen ? 'block' : 'hidden md:block'}`}>
                        <button
                            className="md:hidden flex items-center gap-2 bg-transparent border-none text-base-content/60 text-sm font-medium p-0 mb-6 cursor-pointer hover:text-primary"
                            onClick={handleBackToMenu}
                        >
                            <ArrowLeft size={16} />
                            Back to Settings
                        </button>
                        {renderContent()}
                    </section>
                </div>
            </main>

            <BottomNav activePage="settings" />
        </div>
    );
}
