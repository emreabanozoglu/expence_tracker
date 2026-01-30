'use client';

import React from 'react';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { exportToCSV } from '@/lib/utils/export';
import { Download, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './ExportSettings.module.css';

export default function ExportSettings() {
    const { expenses } = useExpenses();
    const { settings } = useSettingsContext();

    const handleExportCSV = () => {
        exportToCSV(expenses, settings.dateFormat);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Export Data</h2>
            <p className={styles.description}>
                Download your transaction history for backup or external analysis.
            </p>

            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <FileText size={24} />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.cardTitle}>CSV Export</h3>
                    <p className={styles.cardDescription}>
                        Export all your income and expenses to a CSV file. Compatible with Excel, Google Sheets, and other spreadsheet software.
                    </p>
                    <div className={styles.action}>
                        <Button
                            variant="primary"
                            onClick={handleExportCSV}
                            disabled={expenses.length === 0}
                        >
                            <Download size={18} />
                            Download CSV
                        </Button>
                        {expenses.length === 0 && (
                            <p className={styles.emptyHint}>No transactions to export yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
