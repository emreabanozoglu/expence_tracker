// Shares the payday rule so the dashboard filter reacts when the
// salary recurring transaction is updated.

'use client';

import React, { createContext, useContext } from 'react';
import { usePaydayConfig } from '../hooks/usePaydayConfig';
import { PaydayConfig } from '../types';

interface PaydayContextType {
    paydayConfig: PaydayConfig;
    isConfigured: boolean;
    isLoading: boolean;
    reloadPaydayConfig: () => Promise<void>;
}

const PaydayContext = createContext<PaydayContextType | undefined>(undefined);

export function PaydayProvider({ children }: { children: React.ReactNode }) {
    const value = usePaydayConfig();

    return <PaydayContext.Provider value={value}>{children}</PaydayContext.Provider>;
}

export function usePaydayContext() {
    const context = useContext(PaydayContext);
    if (context === undefined) {
        throw new Error('usePaydayContext must be used within a PaydayProvider');
    }
    return context;
}
