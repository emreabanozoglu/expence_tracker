import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SettingsProvider } from '@/lib/context/SettingsContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';

export const metadata: Metadata = {
  title: "Expense Tracker - Manage Your Finances",
  description: "Track your expenses, visualize spending patterns, and manage your budget effectively.",
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
          <SettingsProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
