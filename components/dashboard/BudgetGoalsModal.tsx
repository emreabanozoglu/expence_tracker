'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import BudgetProgress from './BudgetProgress';
import { Expense } from '@/lib/types';

interface BudgetGoalsModalProps {
    isOpen: boolean;
    onClose: () => void;
    expenses: Expense[];
    expenseTarget?: number;
    savingTarget?: number;
    currencySymbol: string;
}

export default function BudgetGoalsModal({
    isOpen,
    onClose,
    expenses,
    expenseTarget,
    savingTarget,
    currencySymbol
}: BudgetGoalsModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Budget & Goals"
        >
            <div style={{ paddingTop: '16px' }}>
                <BudgetProgress
                    expenses={expenses}
                    expenseTarget={expenseTarget}
                    savingTarget={savingTarget}
                    currencySymbol={currencySymbol}
                />
            </div>
        </Modal>
    );
}
