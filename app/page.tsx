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

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="Bibudget Logo" width={32} height={32} />
            <span className="text-xl font-bold text-base-content">Bibudget</span>
          </Link>

          <div className="flex items-center gap-4 md:gap-8">
            <Link href="#features" className="hidden md:block text-sm font-medium text-base-content/60 hover:text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="hidden md:block text-sm font-medium text-base-content/60 hover:text-primary transition-colors">Pricing</Link>
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
