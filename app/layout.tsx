import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SettingsProvider } from '@/lib/context/SettingsContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { SubscriptionProvider } from '@/lib/context/SubscriptionContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import RecurringTransactionManager from '@/components/RecurringTransactionManager';
import PricingModal from '@/components/pricing-modal';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Bibudget - Manage Your Finances",
  description: "Track your expenses, visualize spending patterns, and manage your budget effectively with Bibudget.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <AuthProvider>
          <SubscriptionProvider>
            <RecurringTransactionManager />
            <SettingsProvider>
              <ThemeProvider>
                {children}
                <PricingModal />
                <Toaster position="top-center" />
              </ThemeProvider>
            </SettingsProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
