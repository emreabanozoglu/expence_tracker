'use client';

import { useProcessRecurringTransactions } from '@/lib/hooks/useProcessRecurringTransactions';

export default function RecurringTransactionManager() {
    useProcessRecurringTransactions();
    return null;
}
