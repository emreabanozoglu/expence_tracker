'use client';

import React from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import Button from '@/components/ui/Button';

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
        <section className="py-24 px-4 bg-base-200" id="pricing">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-base-content">
                        Simple, Transparent
                        <span className="bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent"> Pricing</span>
                    </h2>
                    <p className="text-lg text-base-content/60 max-w-[600px] mx-auto">
                        Start free, upgrade when you need more. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`
                                relative flex flex-col bg-base-100 border-2 rounded-2xl p-8
                                hover:-translate-y-2 hover:shadow-xl transition-all duration-300
                                ${plan.popular ? 'border-primary shadow-[0_0_0_1px_rgba(var(--primary),1)]' : 'border-base-300'}
                            `}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                                    Most Popular
                                </div>
                            )}

                            <div className="text-center mb-6 pb-6 border-b border-base-200">
                                <h3 className="text-2xl font-bold mb-4 text-base-content">{plan.name}</h3>
                                <div className="mb-2">
                                    <div className="text-5xl font-extrabold text-base-content leading-none">{plan.price}</div>
                                    <div className="text-sm text-base-content/60 mt-1">{plan.period}</div>
                                </div>
                                {plan.yearlyPrice && (
                                    <div className="text-sm text-base-content/70 mt-2 flex items-center justify-center gap-2">
                                        or {plan.yearlyPrice} {plan.yearlyPeriod}
                                        <span className="bg-success/10 text-success px-2 py-0.5 rounded text-xs font-bold">Save 17%</span>
                                    </div>
                                )}
                                <p className="text-sm text-base-content/60 mt-4 m-0">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[15px]">
                                        <span className={`
                                            flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                                            ${feature.included ? 'bg-success/10 text-success' : 'bg-base-200 text-base-content/40'}
                                        `}>
                                            {feature.included ? <Check size={14} /> : <X size={14} />}
                                        </span>
                                        <span className={feature.included ? 'text-base-content/80' : 'text-base-content/40 line-through'}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.href} className="mt-auto">
                                <Button
                                    variant={plan.popular ? 'primary' : 'ghost'}
                                    size="lg"
                                    className="w-full"
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
