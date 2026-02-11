'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 px-4 md:min-h-[80vh] md:py-12">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="absolute rounded-full blur-[80px] opacity-30 animate-[float_20s_ease-in-out_infinite] w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
                    style={{
                        background: 'linear-gradient(135deg, var(--primary-500), hsl(280, 85%, 60%))',
                        top: '-10%',
                        left: '-10%',
                        animationDelay: '0s'
                    }}
                ></div>
                <div
                    className="absolute rounded-full blur-[80px] opacity-30 animate-[float_20s_ease-in-out_infinite] w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
                    style={{
                        background: 'linear-gradient(135deg, hsl(200, 85%, 55%), var(--primary-500))',
                        bottom: '-10%',
                        right: '-5%',
                        animationDelay: '7s'
                    }}
                ></div>
                <div
                    className="absolute rounded-full blur-[80px] opacity-30 animate-[float_20s_ease-in-out_infinite] w-[300px] h-[300px] md:w-[350px] md:h-[350px]"
                    style={{
                        background: 'linear-gradient(135deg, hsl(280, 85%, 60%), hsl(340, 85%, 60%))',
                        top: '50%',
                        right: '10%',
                        animationDelay: '14s'
                    }}
                ></div>
            </div>

            <div className="relative z-10 max-w-[900px] text-center animate-[fadeInUp_0.8s_ease-out]">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-200 rounded-full text-sm font-medium text-primary mb-6 shadow-md backdrop-blur-md">
                    <Sparkles size={16} />
                    <span>Smart Financial Management</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-base-content">
                    Take Control of Your
                    <span className="bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent"> Finances</span>
                </h1>

                <p className="text-lg md:text-xl leading-relaxed text-base-content/70 mb-12 max-w-[700px] mx-auto">
                    Track expenses, visualize spending patterns, and achieve your financial goals with Bibudget.
                    The modern expense tracker designed for clarity and simplicity.
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center flex-wrap mb-16">
                    <Link href="/auth" className="w-full md:w-auto">
                        <Button variant="primary" size="lg" className="w-full md:w-auto gap-2">
                            Get Started Free
                            <ArrowRight size={20} />
                        </Button>
                    </Link>
                    <Link href="#features" className="w-full md:w-auto">
                        <Button variant="ghost" size="lg" className="w-full md:w-auto">
                            Learn More
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12 pt-12 border-t border-base-200">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-1">100%</div>
                        <div className="text-sm font-medium text-base-content/60">Free to Start</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-1">∞</div>
                        <div className="text-sm font-medium text-base-content/60">Transactions</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-1">24/7</div>
                        <div className="text-sm font-medium text-base-content/60">Access</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
