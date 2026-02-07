'use client';

import { useState, useEffect } from 'react';
import { useSubscription } from '@/lib/context/SubscriptionContext';
import { CreditCard, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import styles from './SubscriptionSettings.module.css';

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
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading subscription details...</p>
            </div>
        );
    }

    // Free user
    if (!isPro) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Subscription</h2>
                <div className={styles.card}>
                    <div className={styles.statusBadge} data-status="free">
                        <XCircle size={16} />
                        Free Plan
                    </div>
                    <p className={styles.description}>
                        You're currently on the free plan with limited features.
                    </p>
                    <div className={styles.features}>
                        <p className={styles.featureTitle}>Free plan includes:</p>
                        <ul>
                            <li>Up to 10 transactions</li>
                            <li>Basic expense tracking</li>
                            <li>Simple charts</li>
                        </ul>
                    </div>
                    <p className={styles.upgradePrompt}>
                        Upgrade to Pro for unlimited transactions and advanced features!
                    </p>
                    <div className={styles.actions}>
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
        <div className={styles.container}>
            <h2 className={styles.title}>Subscription</h2>

            {/* Cancellation Warning Banner */}
            {subscriptionDetails?.cancelAtPeriodEnd && (
                <div className={styles.warningBanner}>
                    <AlertCircle size={20} />
                    <div>
                        <strong>Subscription Cancelled</strong>
                        <p>
                            Your subscription has been cancelled. You'll continue to have Pro access until{' '}
                            <strong>{formatDate(subscriptionDetails.currentPeriodEnd)}</strong>.
                            After this date, your account will revert to the free plan.
                        </p>
                    </div>
                </div>
            )}

            <div className={styles.card}>
                <div className={styles.statusBadge} data-status="pro">
                    <CheckCircle size={16} />
                    Pro Plan
                </div>

                {subscriptionDetails ? (
                    <>
                        <div className={styles.planDetails}>
                            <div className={styles.detailRow}>
                                <CreditCard size={18} />
                                <div>
                                    <span className={styles.label}>Plan</span>
                                    <span className={styles.value}>{subscriptionDetails.planName}</span>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <Calendar size={18} />
                                <div>
                                    <span className={styles.label}>Price</span>
                                    <span className={styles.value}>
                                        {formatPrice(
                                            subscriptionDetails.amount,
                                            subscriptionDetails.currency,
                                            subscriptionDetails.interval
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <Calendar size={18} />
                                <div>
                                    <span className={styles.label}>
                                        {subscriptionDetails.cancelAtPeriodEnd ? 'Valid Until' : 'Next Billing Date'}
                                    </span>
                                    <span className={styles.value}>
                                        {formatDate(subscriptionDetails.currentPeriodEnd)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!subscriptionDetails.cancelAtPeriodEnd && (
                            <div className={styles.actions}>
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
                    <p className={styles.description}>
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
                <div className={styles.modalContent}>
                    <p className={styles.modalText}>
                        Are you sure you want to cancel your subscription?
                    </p>
                    <div className={styles.modalInfo}>
                        <AlertCircle size={18} />
                        <p>
                            You'll continue to have Pro access until{' '}
                            <strong>{subscriptionDetails && formatDate(subscriptionDetails.currentPeriodEnd)}</strong>.
                            After that, your account will revert to the free plan.
                        </p>
                    </div>
                    <div className={styles.modalActions}>
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
