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
        <section className="py-24 px-4 bg-base-100" id="features">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-base-content">
                        Everything You Need to
                        <span className="bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent"> Manage Your Money</span>
                    </h2>
                    <p className="text-lg text-base-content/60 max-w-[600px] mx-auto">
                        Powerful features designed to give you complete control over your finances
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`
                                group relative overflow-hidden bg-base-100 border border-base-200 rounded-xl p-6
                                hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 transition-all duration-300
                                animate-[fadeInUp_0.6s_ease-out_backwards]
                            `}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-base-content">{feature.title}</h3>
                            <p className="text-sm leading-relaxed text-base-content/70">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
