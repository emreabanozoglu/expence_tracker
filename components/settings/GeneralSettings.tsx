'use client';

import React from 'react';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { useAuth } from '@/lib/context/AuthContext';
import CurrencySelector from './CurrencySelector';
import DateFormatSelector from './DateFormatSelector';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { User } from 'lucide-react';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import styles from './GeneralSettings.module.css';

export default function GeneralSettings() {
    const { settings, updateCurrency, updateDateFormat } = useSettingsContext();
    const { user } = useAuth();

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>General Settings</h2>

            <div className={styles.stack}>
                {/* Profile Section */}
                {user && (
                    <div className={styles.section} data-testid="profile-section">
                        <label className={styles.sectionLabel}>Profile</label>
                        <div className={styles.profileCard}>
                            <div className={styles.avatar}>
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className={styles.name}>
                                    {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                                </h3>
                                <p className={styles.email}>{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.divider} />

                {/* Appearance Section */}
                <div className={styles.section} data-testid="appearance-section">
                    <label className={styles.sectionLabel}>Appearance</label>
                    <div className={styles.profileCard} style={{ justifyContent: 'space-between' }}>
                        <div>
                            <h3 className={styles.name}>Theme</h3>
                            <p className={styles.email}>Toggle between light and dark mode</p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                <div className={styles.divider} />

                {/* Currency Section */}
                <div className={styles.section} data-testid="currency-section">
                    <CurrencySelector
                        selectedCurrency={settings.currency}
                        onCurrencyChange={updateCurrency}
                    />
                </div>

                <div className={styles.divider} />

                {/* Date Format Section */}
                <div className={styles.section} data-testid="date-format-section">
                    <DateFormatSelector
                        selectedFormat={settings.dateFormat || 'MM/dd/yyyy'}
                        onFormatChange={updateDateFormat}
                    />
                </div>
                <div className={styles.divider} />

                {/* App Installation Section - Only visible on mobile web */}
                <InstallPrompt />
            </div>
        </div>
    );
}
