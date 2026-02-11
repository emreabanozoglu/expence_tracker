'use client';

import React from 'react';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { useAuth } from '@/lib/context/AuthContext';
import CurrencySelector from './CurrencySelector';
import DateFormatSelector from './DateFormatSelector';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { User } from 'lucide-react';
import InstallPrompt from '@/components/pwa/InstallPrompt';

export default function GeneralSettings() {
    const { settings, updateCurrency, updateDateFormat } = useSettingsContext();
    const { user } = useAuth();

    return (
        <div className="w-full max-w-3xl">
            <h2 className="text-xl font-bold mb-6 text-base-content">General Settings</h2>

            <div className="flex flex-col gap-8">
                {/* Profile Section */}
                {user && (
                    <div data-testid="profile-section">
                        <label className="block mb-3 text-sm font-bold uppercase tracking-wide text-base-content/60">Profile</label>
                        <div className="flex items-center gap-4 p-6 bg-base-100 border border-base-200 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content shadow-sm">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-base-content m-0">
                                    {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                                </h3>
                                <p className="text-sm text-base-content/60 m-0">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="h-px bg-base-200 w-full my-2" />

                {/* Appearance Section */}
                <div data-testid="appearance-section">
                    <label className="block mb-3 text-sm font-bold uppercase tracking-wide text-base-content/60">Appearance</label>
                    <div className="flex justify-between items-center p-6 bg-base-100 border border-base-200 rounded-xl">
                        <div>
                            <h3 className="text-base font-bold text-base-content m-0">Theme</h3>
                            <p className="text-sm text-base-content/60 m-0">Toggle between light and dark mode</p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                <div className="h-px bg-base-200 w-full my-2" />

                {/* Currency Section */}
                <div data-testid="currency-section">
                    <CurrencySelector
                        selectedCurrency={settings.currency}
                        onCurrencyChange={updateCurrency}
                    />
                </div>

                <div className="h-px bg-base-200 w-full my-2" />

                {/* Date Format Section */}
                <div data-testid="date-format-section">
                    <DateFormatSelector
                        selectedFormat={settings.dateFormat || 'MM/dd/yyyy'}
                        onFormatChange={updateDateFormat}
                    />
                </div>

                <div className="h-px bg-base-200 w-full my-2 hidden md:block" />

                {/* App Installation Section - Only visible on mobile web */}
                <InstallPrompt />
            </div>
        </div>
    );
}
