'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroBackground}>
                <div className={styles.gradientOrb1}></div>
                <div className={styles.gradientOrb2}></div>
                <div className={styles.gradientOrb3}></div>
            </div>

            <div className={styles.heroContent}>
                <div className={styles.badge}>
                    <Sparkles size={16} />
                    <span>Smart Financial Management</span>
                </div>

                <h1 className={styles.heroTitle}>
                    Take Control of Your
                    <span className={styles.gradient}> Finances</span>
                </h1>

                <p className={styles.heroSubtitle}>
                    Track expenses, visualize spending patterns, and achieve your financial goals with Bibudget.
                    The modern expense tracker designed for clarity and simplicity.
                </p>

                <div className={styles.ctaButtons}>
                    <Link href="/auth">
                        <Button variant="primary" size="lg">
                            Get Started Free
                            <ArrowRight size={20} />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="ghost" size="lg">
                            Learn More
                        </Button>
                    </Link>
                </div>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <div className={styles.statValue}>100%</div>
                        <div className={styles.statLabel}>Free to Start</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statValue}>∞</div>
                        <div className={styles.statLabel}>Transactions</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statValue}>24/7</div>
                        <div className={styles.statLabel}>Access</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
