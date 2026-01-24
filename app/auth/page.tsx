// Auth Page Component - Login and Sign Up

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import styles from './auth.module.css';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = isSignUp
                ? await signUp(email, password)
                : await signIn(email, password);

            if (result.error) {
                setError(result.error.message);
            } else {
                if (isSignUp) {
                    // Check if user is already logged in (email confirmation disabled)
                    // or if they need to confirm email
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session) {
                        // User is logged in - email confirmation is disabled
                        router.push('/');
                    } else {
                        // User needs to confirm email
                        setError('Check your email to confirm your account!');
                    }
                } else {
                    router.push('/');
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
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>💰 Expense Tracker</h1>
                    <p className={styles.subtitle}>
                        {isSignUp ? 'Create your account' : 'Welcome back'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
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
                            placeholder="you@example.com"
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
                            autoComplete={isSignUp ? 'new-password' : 'current-password'}
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
                        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError('');
                        }}
                        className={styles.toggleButton}
                        data-testid="auth-toggle-button"
                    >
                        {isSignUp
                            ? 'Already have an account? Sign in'
                            : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
