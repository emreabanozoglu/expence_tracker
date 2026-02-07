'use client';

import { useSubscription } from '@/lib/context/SubscriptionContext';
import { useExpenses } from '@/lib/hooks/useExpenses';

export default function UsageLimit() {
    const { isPro, openPricingModal } = useSubscription();
    const { expenses } = useExpenses();
    const limit = 10;
    const count = expenses.length;
    const remaining = Math.max(0, limit - count);
    const percentage = Math.min(100, (count / limit) * 100);

    if (isPro) return null;

    return (
        <div className="bg-card p-4 rounded-lg shadow-sm mb-4 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Free Plan Usage</span>
                <span className="text-xs text-gray-500">{count} / {limit} transactions</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 dark:bg-gray-700">
                <div
                    className={`h-2.5 rounded-full ${percentage >= 100 ? 'bg-red-500' : 'bg-primary-500'}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            {percentage >= 100 ? (
                <div className="text-sm mt-3">
                    <p className="text-red-500 mb-2">Limit reached!</p>
                    <button
                        onClick={openPricingModal}
                        className="text-xs w-full bg-primary-600 text-white py-1.5 rounded hover:bg-primary-700 transition"
                    >
                        Upgrade to Unlimited
                    </button>
                </div>
            ) : (
                <p className="text-xs text-gray-500 text-center">
                    {remaining} transaction{remaining !== 1 ? 's' : ''} remaining
                </p>
            )}
        </div>
    );
}
