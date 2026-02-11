'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useSubscription } from '@/lib/context/SubscriptionContext';
import { Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

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
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center p-2 w-full">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`
                            flex-1 flex flex-col relative bg-base-100 border rounded-2xl p-6 min-w-[280px] transition-all duration-300
                            ${plan.highlight
                                ? 'border-primary shadow-[0_0_25px_rgba(var(--primary),0.15)] bg-gradient-to-b from-base-100 to-primary/5 z-10 scale-100 md:scale-105'
                                : 'border-base-200 hover:border-primary/30'
                            }
                        `}
                    >
                        {plan.highlight && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-primary to-primary-focus text-primary-content text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap z-20">
                                <Sparkles size={12} fill="currentColor" />
                                BEST VALUE
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-base-content mb-1">{plan.name}</h3>
                            <p className="text-sm text-base-content/60 m-0">{plan.description}</p>
                        </div>

                        <div className="text-center mb-6">
                            <span className="text-4xl font-extrabold text-base-content">{plan.price}</span>
                            <span className="text-base font-medium text-base-content/60 ml-1">{plan.period}</span>
                        </div>

                        <ul className="list-none p-0 m-0 mb-8 flex flex-col gap-3 flex-1">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-sm text-base-content/80">
                                    <Check size={16} className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-primary font-bold' : 'text-primary'}`} />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
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

            <p className="text-center text-xs text-base-content/40 mt-6">
                Secure payments powered by Stripe. Cancel anytime.
            </p>
        </Modal>
    );
}
