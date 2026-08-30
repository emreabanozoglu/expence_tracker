// Reads the payday rule from the user's salary recurring transaction.
// The dashboard's salary-cycle filter derives its boundaries from this.

'use client';

import { useCallback, useEffect, useState } from 'react';
import { PaydayConfig, PaydayRule } from '../types';
import { DEFAULT_PAYDAY_CONFIG } from '../utils/salaryCycle';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';

interface PaydayRow {
    payday_rule: PaydayRule | null;
    payday_day_of_month: number | null;
}

const toConfig = (row: PaydayRow | null): PaydayConfig => {
    if (!row?.payday_rule) return DEFAULT_PAYDAY_CONFIG;
    return {
        rule: row.payday_rule,
        dayOfMonth: row.payday_day_of_month ?? undefined,
    };
};

export function usePaydayConfig() {
    const { user } = useAuth();
    const [config, setConfig] = useState<PaydayConfig>(DEFAULT_PAYDAY_CONFIG);
    const [isConfigured, setIsConfigured] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const load = useCallback(async () => {
        if (!user) {
            setConfig(DEFAULT_PAYDAY_CONFIG);
            setIsConfigured(false);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const { data, error } = await (supabase
            .from('recurring_transactions') as any)
            .select('payday_rule, payday_day_of_month')
            .eq('user_id', user.id)
            .not('payday_rule', 'is', null)
            .maybeSingle();

        if (error) {
            console.error('Failed to load payday config:', error);
            setConfig(DEFAULT_PAYDAY_CONFIG);
            setIsConfigured(false);
        } else {
            setConfig(toConfig(data));
            setIsConfigured(!!data?.payday_rule);
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        void load();
    }, [load]);

    return { paydayConfig: config, isConfigured, isLoading, reloadPaydayConfig: load };
}
