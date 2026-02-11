'use client';

import React from 'react';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { exportToCSV } from '@/lib/utils/export';
import { Download, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ExportSettings() {
    const { expenses } = useExpenses();
    const { settings } = useSettingsContext();

    const handleExportCSV = () => {
        exportToCSV(expenses, settings.dateFormat);
    };

    return (
        <div className="w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-2 text-base-content">Export Data</h2>
            <p className="text-base-content/60 mb-8">
                Download your transaction history for backup or external analysis.
            </p>

            <div className="flex flex-col md:flex-row gap-6 p-6 bg-base-100 border border-base-200 rounded-xl shadow-sm items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-base-content mb-2">CSV Export</h3>
                    <p className="text-sm text-base-content/60 mb-6 leading-relaxed">
                        Export all your income and expenses to a CSV file. Compatible with Excel, Google Sheets, and other spreadsheet software.
                    </p>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="primary"
                            onClick={handleExportCSV}
                            disabled={expenses.length === 0}
                        >
                            <Download size={18} />
                            Download CSV
                        </Button>
                        {expenses.length === 0 && (
                            <p className="text-sm text-base-content/40 italic m-0">No transactions to export yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
