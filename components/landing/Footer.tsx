'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Mail } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <Image src="/logo.png" alt="Bibudget Logo" width={32} height={32} />
                            <span className={styles.brandName}>Bibudget</span>
                        </div>
                        <p className={styles.tagline}>
                            Take control of your finances with smart expense tracking and budgeting tools.
                        </p>
                        <div className={styles.social}>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <Github size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="mailto:support@bibudget.com" aria-label="Email">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkTitle}>Product</h4>
                            <ul className={styles.linkList}>
                                <li><Link href="#features">Features</Link></li>
                                <li><Link href="#pricing">Pricing</Link></li>
                                <li><Link href="/auth">Sign Up</Link></li>
                                <li><Link href="/auth">Login</Link></li>
                            </ul>
                        </div>

                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkTitle}>Company</h4>
                            <ul className={styles.linkList}>
                                <li><Link href="/about">About</Link></li>
                                <li><Link href="/blog">Blog</Link></li>
                                <li><Link href="/careers">Careers</Link></li>
                                <li><Link href="/contact">Contact</Link></li>
                            </ul>
                        </div>

                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkTitle}>Legal</h4>
                            <ul className={styles.linkList}>
                                <li><Link href="/privacy">Privacy Policy</Link></li>
                                <li><Link href="/terms">Terms of Service</Link></li>
                                <li><Link href="/cookies">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {currentYear} Bibudget. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
