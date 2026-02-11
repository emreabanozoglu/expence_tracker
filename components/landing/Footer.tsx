'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-base-100 border-t border-base-200 py-16 px-4 pb-8">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 mb-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Image src="/logo.png" alt="Bibudget Logo" width={32} height={32} />
                            <span className="text-2xl font-bold text-base-content">Bibudget</span>
                        </div>
                        <p className="text-[15px] text-base-content/60 leading-relaxed max-w-[300px] m-0">
                            Take control of your finances with smart expense tracking and budgeting tools.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                                className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Twitter size={20} />
                            </a>
                            <a
                                href="mailto:support@bibudget.com"
                                aria-label="Email"
                                className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-1">Product</h4>
                            <ul className="flex flex-col gap-2 p-0 m-0 list-none">
                                <li><Link href="#features" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">Features</Link></li>
                                <li><Link href="#pricing" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">Pricing</Link></li>
                                <li><Link href="/auth" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">Sign Up</Link></li>
                                <li><Link href="/auth" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">Login</Link></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-1">Company</h4>
                            <ul className="flex flex-col gap-2 p-0 m-0 list-none">
                                <li><Link href="/about" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">About</Link></li>
                                <li><Link href="/blog" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">Blog</Link></li>
                                <li><Link href="/careers" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">Careers</Link></li>
                                <li><Link href="/contact" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-1">Legal</h4>
                            <ul className="flex flex-col gap-2 p-0 m-0 list-none">
                                <li><Link href="/privacy" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">Terms of Service</Link></li>
                                <li><Link href="/cookies" className="text-[15px] text-base-content/60 hover:text-primary transition-colors">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-base-200 text-center">
                    <p className="text-sm text-base-content/50 m-0">
                        © {currentYear} Bibudget. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
