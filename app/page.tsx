'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/landing/Footer';
import styles from './landing.module.css';

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.brand}>
            <Image src="/logo.png" alt="Bibudget Logo" width={32} height={32} />
            <span className={styles.brandName}>Bibudget</span>
          </Link>

          <div className={styles.navLinks}>
            <Link href="#features" className={styles.navLink}>Features</Link>
            <Link href="#pricing" className={styles.navLink}>Pricing</Link>
            <ThemeToggle />
            <Link href="/auth">
              <Button variant="primary">
                <LogIn size={18} />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
