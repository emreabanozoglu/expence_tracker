import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SettingsProvider } from '@/lib/context/SettingsContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import RecurringTransactionManager from '@/components/RecurringTransactionManager';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "BiBudget - Manage Your Finances",
  description: "Track your expenses, visualize spending patterns, and manage your budget effectively with BiBudget.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <RecurringTransactionManager />
          <SettingsProvider>
            <ThemeProvider>
              {children}
              <Toaster position="bottom-right" />
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
