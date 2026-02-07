'use client';

import { useSubscription } from '@/lib/context/SubscriptionContext';
import { Crown } from 'lucide-react';

export default function UpgradeButton() {
    const { isPro, openPricingModal } = useSubscription();

    if (isPro) return null;

    return (
        <button
            onClick={openPricingModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm font-medium text-sm"
        >
            <Crown size={16} />
            Upgrade to Pro
        </button>
    );
}
