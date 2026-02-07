'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useSubscription } from '@/lib/context/SubscriptionContext';
import { Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './pricing-modal.module.css';

export default function PricingModal() {
    const { isPricingModalOpen, closePricingModal } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);

    const plans = [
        {
            name: 'Monthly Pro',
            price: '€3.99',
            period: '/mo',
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || 'price_placeholder_monthly',
            description: 'Perfect for getting started',
            features: [
                'Unlimited Transactions',
                'Advanced Charts & Analytics',
                'Priority Email Support',
                'Export Data to CSV',
            ],
            highlight: false,
        },
        {
            name: 'Yearly Pro',
            price: '€39.99',
            period: '/yr',
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || 'price_placeholder_yearly',
            description: 'Best value for long-term power users',
            features: [
                'All Monthly Features',
                'Save 16% vs Monthly (€7.89/year)',
                'Early Access to New Features',
                'VIP Support Badge',
            ],
            highlight: true,
        },
    ];

    const handleSubscribe = async (priceId: string) => {
        if (!priceId || priceId.startsWith('price_placeholder')) {
            toast.error('Stripe configuration missing. Please check env variables.');
            return;
        }

        if (priceId.startsWith('prod_')) {
            toast.error('Invalid Price ID. You used a Product ID (prod_...) instead of a Price ID (price_...). Check your .env file.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const { sessionId, url } = await response.json();
            console.log('Checkout session created:', sessionId);

            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error) {
            console.error('Checkout flow error:', error);
            toast.error('Failed to start checkout');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isPricingModalOpen}
            onClose={closePricingModal}
            title="Upgrade to Pro"
            size="lg"
        >
            <div className={styles.container}>
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`${styles.card} ${plan.highlight ? styles.highlight : ''}`}
                    >
                        {plan.highlight && (
                            <div className={styles.badge}>
                                <Sparkles size={12} fill="currentColor" />
                                BEST VALUE
                            </div>
                        )}

                        <div className={styles.header}>
                            <h3 className={styles.planName}>{plan.name}</h3>
                            <p className={styles.description}>{plan.description}</p>
                        </div>

                        <div className={styles.priceContainer}>
                            <span className={styles.price}>{plan.price}</span>
                            <span className={styles.period}>{plan.period}</span>
                        </div>

                        <ul className={styles.features}>
                            {plan.features.map((feature) => (
                                <li key={feature} className={styles.featureItem}>
                                    <Check size={16} className={styles.checkIcon} />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className={styles.buttonContainer}>
                            <Button
                                onClick={() => handleSubscribe(plan.priceId)}
                                disabled={isLoading}
                                variant={plan.highlight ? 'primary' : 'secondary'}
                                fullWidth
                                size="lg"
                            >
                                {isLoading ? 'Processing...' : (plan.highlight ? 'Get Full Access' : 'Start Monthly')}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <p className={styles.footer}>
                Secure payments powered by Stripe. Cancel anytime.
            </p>
        </Modal>
    );
}
