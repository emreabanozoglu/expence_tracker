'use client';

import React from 'react';
import { Check } from 'lucide-react';
import styles from './DateFormatSelector.module.css';

interface DateFormatSelectorProps {
    selectedFormat: string;
    onFormatChange: (format: string) => void;
}

const DATE_FORMATS = [
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY', example: '12/31/2026' },
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY', example: '31/12/2026' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD', example: '2026-12-31' },
];

export default function DateFormatSelector({ selectedFormat, onFormatChange }: DateFormatSelectorProps) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Date Format</h2>
            <div className={styles.grid}>
                {DATE_FORMATS.map((format) => (
                    <button
                        key={format.value}
                        className={`${styles.card} ${selectedFormat === format.value ? styles.selected : ''}`}
                        onClick={() => onFormatChange(format.value)}
                        type="button"
                        data-testid={`date-format-${format.value}`}
                    >
                        <div className={styles.label}>{format.label}</div>
                        <div className={styles.example}>{format.example}</div>
                        {selectedFormat === format.value && (
                            <div className={styles.checkIcon}>
                                <Check size={16} />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
