'use client';

import React from 'react';
import { Check } from 'lucide-react';

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
        <div className="w-full">
            <h2 className="text-base font-bold text-base-content mb-3">Date Format</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DATE_FORMATS.map((format) => (
                    <button
                        key={format.value}
                        className={`
                            relative flex flex-col items-start p-3 rounded-lg text-left transition-all duration-200 border
                            ${selectedFormat === format.value
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-base-200 bg-base-100 hover:border-primary/50'
                            }
                        `}
                        onClick={() => onFormatChange(format.value)}
                        type="button"
                        data-testid={`date-format-${format.value}`}
                    >
                        <div className="font-semibold text-sm text-base-content mb-0.5">{format.label}</div>
                        <div className="text-xs text-base-content/60">{format.example}</div>
                        {selectedFormat === format.value && (
                            <div className="absolute top-2 right-2 text-primary bg-base-100 rounded-full p-0.5 shadow-sm border border-base-200">
                                <Check size={14} />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
