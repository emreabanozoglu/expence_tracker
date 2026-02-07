'use client';

import React from 'react';
import {
    TrendingUp,
    PieChart,
    Target,
    Repeat,
    Globe,
    Download,
    Zap,
    Shield,
    Smartphone
} from 'lucide-react';
import styles from './Features.module.css';

const features = [
    {
        icon: TrendingUp,
        title: 'Real-time Tracking',
        description: 'Monitor your expenses and income in real-time with instant updates and notifications.'
    },
    {
        icon: PieChart,
        title: 'Visual Analytics',
        description: 'Beautiful charts and breakdowns help you understand your spending patterns at a glance.'
    },
    {
        icon: Target,
        title: 'Budget Goals',
        description: 'Set spending limits and savings targets to stay on track with your financial goals.'
    },
    {
        icon: Repeat,
        title: 'Recurring Transactions',
        description: 'Automate recurring expenses and income to save time and never miss a payment.'
    },
    {
        icon: Globe,
        title: 'Multi-Currency',
        description: 'Support for multiple currencies with automatic conversion and localization.'
    },
    {
        icon: Download,
        title: 'Data Export',
        description: 'Export your financial data to CSV for analysis, tax preparation, or backup.'
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Optimized performance ensures smooth experience even with thousands of transactions.'
    },
    {
        icon: Shield,
        title: 'Secure & Private',
        description: 'Your financial data is encrypted and stored securely with industry-standard protection.'
    },
    {
        icon: Smartphone,
        title: 'Mobile Friendly',
        description: 'Fully responsive design works seamlessly on desktop, tablet, and mobile devices.'
    }
];

export default function Features() {
    return (
        <section className={styles.features} id="features">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Everything You Need to
                        <span className={styles.gradient}> Manage Your Money</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Powerful features designed to give you complete control over your finances
                    </p>
                </div>

                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={styles.card}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={styles.iconWrapper}>
                                <feature.icon size={24} />
                            </div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
