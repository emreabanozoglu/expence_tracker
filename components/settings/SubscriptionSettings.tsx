'use client';

import { useState, useEffect } from 'react';
import { useSubscription } from '@/lib/context/SubscriptionContext';
import { CreditCard, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

interface SubscriptionDetails {
    status: 'active' | 'canceled' | 'none';
    planName: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}

export default function SubscriptionSettings() {
    const { isPro, subscription, refreshSubscription, openPricingModal } = useSubscription();
    const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCanceling, setIsCanceling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        fetchSubscriptionDetails();
    }, [subscription]);

    const fetchSubscriptionDetails = async () => {
        if (!isPro || !subscription?.stripe_subscription_id) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/stripe/subscription-details');
            if (!response.ok) throw new Error('Failed to fetch subscription details');

            const data = await response.json();
            setSubscriptionDetails(data);
        } catch (error) {
            console.error('Error fetching subscription details:', error);
            toast.error('Failed to load subscription details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        setIsCanceling(true);
        try {
            const response = await fetch('/api/stripe/cancel-subscription', {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to cancel subscription');

            const data = await response.json();
            toast.success('Subscription cancelled. You\'ll retain Pro access until ' + formatDate(data.currentPeriodEnd));

            // Refresh subscription details
            await fetchSubscriptionDetails();
            await refreshSubscription();
            setShowCancelModal(false);
        } catch (error) {
            console.error('Error canceling subscription:', error);
            toast.error('Failed to cancel subscription');
        } finally {
            setIsCanceling(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatPrice = (amount: number, currency: string, interval: string) => {
        const price = (amount / 100).toFixed(2);
        const currencySymbol = currency === 'usd' ? '$' : currency.toUpperCase();
        return `${currencySymbol}${price}/${interval === 'year' ? 'yr' : 'mo'}`;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 gap-4 text-base-content/60">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <p>Loading subscription details...</p>
            </div>
        );
    }

    // Free user
    if (!isPro) {
        return (
            <div className="w-full max-w-xl">
                <h2 className="text-xl font-bold mb-6 text-base-content">Subscription</h2>
                <div className="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-6 bg-base-200 text-base-content/60">
                        <XCircle size={16} />
                        Free Plan
                    </div>
                    <p className="text-base-content/60 mb-4 leading-relaxed">
                        You're currently on the free plan with limited features.
                    </p>
                    <div className="my-6 p-4 bg-base-200/50 rounded-lg">
                        <p className="font-bold mb-2 text-base-content">Free plan includes:</p>
                        <ul className="space-y-1">
                            <li className="text-sm text-base-content/60 flex items-center gap-2 before:content-['•'] before:text-primary before:mr-1">Up to 10 transactions</li>
                            <li className="text-sm text-base-content/60 flex items-center gap-2 before:content-['•'] before:text-primary before:mr-1">Basic expense tracking</li>
                            <li className="text-sm text-base-content/60 flex items-center gap-2 before:content-['•'] before:text-primary before:mr-1">Simple charts</li>
                        </ul>
                    </div>
                    <p className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg text-center font-medium text-primary">
                        Upgrade to Pro for unlimited transactions and advanced features!
                    </p>
                    <div className="mt-6 pt-6 border-t border-base-200">
                        <Button
                            onClick={openPricingModal}
                            variant="primary"
                            fullWidth
                        >
                            Upgrade to Pro
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Pro user
    return (
        <div className="w-full max-w-xl">
            <h2 className="text-xl font-bold mb-6 text-base-content">Subscription</h2>

            {/* Cancellation Warning Banner */}
            {subscriptionDetails?.cancelAtPeriodEnd && (
                <div className="flex gap-4 p-4 bg-warning/10 border border-warning/20 rounded-xl mb-6 text-warning-content">
                    <AlertCircle size={20} className="shrink-0 text-warning" />
                    <div>
                        <strong className="block mb-1">Subscription Cancelled</strong>
                        <p className="text-sm opacity-90 leading-relaxed">
                            Your subscription has been cancelled. You'll continue to have Pro access until{' '}
                            <strong>{formatDate(subscriptionDetails.currentPeriodEnd)}</strong>.
                            After this date, your account will revert to the free plan.
                        </p>
                    </div>
                </div>
            )}

            <div className="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-6 bg-primary/10 text-primary">
                    <CheckCircle size={16} />
                    Pro Plan
                </div>

                {subscriptionDetails ? (
                    <>
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-center gap-4 p-3 bg-base-200/50 rounded-lg">
                                <CreditCard size={18} className="text-primary shrink-0" />
                                <div className="flex flex-col flex-1">
                                    <span className="text-xs uppercase tracking-wider text-base-content/60 font-medium">Plan</span>
                                    <span className="font-semibold text-base-content">{subscriptionDetails.planName}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 bg-base-200/50 rounded-lg">
                                <Calendar size={18} className="text-primary shrink-0" />
                                <div className="flex flex-col flex-1">
                                    <span className="text-xs uppercase tracking-wider text-base-content/60 font-medium">Price</span>
                                    <span className="font-semibold text-base-content">
                                        {formatPrice(
                                            subscriptionDetails.amount,
                                            subscriptionDetails.currency,
                                            subscriptionDetails.interval
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 bg-base-200/50 rounded-lg">
                                <Calendar size={18} className="text-primary shrink-0" />
                                <div className="flex flex-col flex-1">
                                    <span className="text-xs uppercase tracking-wider text-base-content/60 font-medium">
                                        {subscriptionDetails.cancelAtPeriodEnd ? 'Valid Until' : 'Next Billing Date'}
                                    </span>
                                    <span className="font-semibold text-base-content">
                                        {formatDate(subscriptionDetails.currentPeriodEnd)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!subscriptionDetails.cancelAtPeriodEnd && (
                            <div className="mt-6 pt-6 border-t border-base-200">
                                <Button
                                    onClick={() => setShowCancelModal(true)}
                                    variant="secondary"
                                    fullWidth
                                >
                                    Cancel Subscription
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-base-content/60 mb-4 leading-relaxed">
                        You have Pro access. Subscription details are being loaded...
                    </p>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                title="Cancel Subscription"
            >
                <div className="py-4">
                    <p className="text-base text-base-content mb-4">
                        Are you sure you want to cancel your subscription?
                    </p>
                    <div className="flex gap-3 p-4 bg-warning/10 border border-warning/20 rounded-xl mb-6">
                        <AlertCircle size={18} className="shrink-0 text-warning" />
                        <p className="text-sm text-base-content/80 leading-relaxed">
                            You'll continue to have Pro access until{' '}
                            <strong>{subscriptionDetails && formatDate(subscriptionDetails.currentPeriodEnd)}</strong>.
                            After that, your account will revert to the free plan.
                        </p>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                        <Button
                            onClick={() => setShowCancelModal(false)}
                            variant="secondary"
                            disabled={isCanceling}
                        >
                            Keep Subscription
                        </Button>
                        <Button
                            onClick={handleCancelSubscription}
                            variant="primary"
                            disabled={isCanceling}
                        >
                            {isCanceling ? 'Canceling...' : 'Yes, Cancel'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
