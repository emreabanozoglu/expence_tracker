// Auth Page Component - Login and Sign Up

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import TermsOfService from '@/components/auth/TermsOfService';
import MultiStepRegister from '@/components/auth/MultiStepRegister';
import styles from './auth.module.css';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn(email, password);
            if (result.error) {
                setError(result.error.message);
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (data: any) => {
        setError('');
        setLoading(true);

        try {
            const result = await signUp(data.email, data.password, {
                data: {
                    currency: data.currency,
                    first_name: data.firstName,
                    last_name: data.lastName
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                // Check if user is already logged in (email confirmation disabled)
                // or if they need to confirm email
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    router.push('/dashboard');
                } else {
                    setError('Check your email to confirm your account!');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Left Side: Brand Section */}
            <div className={styles.brandSection}>
                <div className={styles.brandContent}>
                    <h1 className={styles.brandTitle}>Master your<br />Finances today.</h1>
                    <p className={styles.brandSubtitle}>
                        Track expenses, manage budgets, and achieve your financial goals with ease.
                        Join thousands of users taking control of their money.
                    </p>

                    {!isSignUp && (
                        <div className={styles.featureGrid}>
                            <div className={styles.featureItem} style={{ animationDelay: '0.1s' }}>
                                <h3>📊 Smart Analytics</h3>
                                <p>Visualize your spending habits with intuitive charts.</p>
                            </div>
                            <div className={styles.featureItem} style={{ animationDelay: '0.2s' }}>
                                <h3>🌍 Multi-Currency</h3>
                                <p>Support for all major world currencies.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Form Section */}
            <div className={styles.formSection}>
                <div className={`${styles.card} ${styles.fadeIn}`}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            {isSignUp ? 'Create an account' : 'Welcome back'}
                        </h2>
                        <p className={styles.subtitle}>
                            {isSignUp
                                ? 'Enter your details to get started.'
                                : 'Please enter your details to sign in.'}
                        </p>
                    </div>

                    {isSignUp ? (
                        <MultiStepRegister
                            onComplete={handleRegister}
                            onLoginClick={() => setIsSignUp(false)}
                            loading={loading}
                            error={error}
                        />
                    ) : (
                        <form onSubmit={handleLogin} className={styles.form}>
                            <div className={styles.field}>
                                <label htmlFor="email" className={styles.label}>
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="email"
                                    data-testid="email-input"
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="password" className={styles.label}>
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    autoComplete="current-password"
                                    data-testid="password-input"
                                />
                            </div>

                            {error && (
                                <div
                                    className={error.includes('Check your email') ? styles.success : styles.error}
                                    data-testid="auth-error-message"
                                >
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={styles.button}
                                disabled={loading}
                                data-testid="auth-submit-button"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div className={styles.footer}>
                                Don't have an account?
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(true)}
                                    className={styles.toggleButton}
                                    data-testid="auth-toggle-button"
                                >
                                    Sign up for free
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
