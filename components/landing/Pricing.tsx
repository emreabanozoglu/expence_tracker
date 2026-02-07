'use client';

import React from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './Pricing.module.css';

const plans = [
    {
        name: 'Free',
        price: '€0',
        period: 'forever',
        description: 'Perfect for getting started with expense tracking',
        features: [
            { text: '10 transactions per month', included: true },
            { text: 'Basic expense tracking', included: true },
            { text: 'Category breakdown', included: true },
            { text: 'Budget goals', included: true },
            { text: 'Data export', included: true },
            { text: 'Unlimited transactions', included: false },
            { text: 'Recurring transactions', included: false },
            { text: 'Advanced analytics', included: false },
        ],
        cta: 'Get Started',
        href: '/auth',
        popular: false
    },
    {
        name: 'Pro',
        price: '€3.99',
        period: 'per month',
        yearlyPrice: '€39.99',
        yearlyPeriod: 'per year',
        description: 'For serious budgeters who want unlimited tracking',
        features: [
            { text: 'Unlimited transactions', included: true },
            { text: 'All Free features', included: true },
            { text: 'Recurring transactions', included: true },
            { text: 'Advanced analytics', included: true },
            { text: 'Priority support', included: true },
            { text: 'Custom categories', included: true },
            { text: 'Multi-device sync', included: true },
            { text: 'Export to multiple formats', included: true },
        ],
        cta: 'Upgrade to Pro',
        href: '/auth',
        popular: true
    }
];

export default function Pricing() {
    return (
        <section className={styles.pricing} id="pricing">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Simple, Transparent
                        <span className={styles.gradient}> Pricing</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Start free, upgrade when you need more. No hidden fees.
                    </p>
                </div>

                <div className={styles.grid}>
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`${styles.card} ${plan.popular ? styles.popular : ''}`}
                        >
                            {plan.popular && (
                                <div className={styles.badge}>Most Popular</div>
                            )}

                            <div className={styles.cardHeader}>
                                <h3 className={styles.planName}>{plan.name}</h3>
                                <div className={styles.priceWrapper}>
                                    <div className={styles.price}>{plan.price}</div>
                                    <div className={styles.period}>{plan.period}</div>
                                </div>
                                {plan.yearlyPrice && (
                                    <div className={styles.yearlyPrice}>
                                        or {plan.yearlyPrice} {plan.yearlyPeriod}
                                        <span className={styles.savings}>Save 17%</span>
                                    </div>
                                )}
                                <p className={styles.description}>{plan.description}</p>
                            </div>

                            <ul className={styles.features}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} className={styles.feature}>
                                        <span className={`${styles.icon} ${feature.included ? styles.included : styles.excluded}`}>
                                            {feature.included ? <Check size={18} /> : <X size={18} />}
                                        </span>
                                        <span className={feature.included ? '' : styles.excludedText}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.href}>
                                <Button
                                    variant={plan.popular ? 'primary' : 'ghost'}
                                    size="lg"
                                    style={{ width: '100%' }}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
