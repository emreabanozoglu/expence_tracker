// Auth Page Component - Login and Sign Up

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
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
            const { error } = isSignUp
                ? await signUp(email, password)
                : await signIn(email, password);

            if (error) {
                setError(error.message);
            } else {
                if (isSignUp) {
                    setError('Check your email to confirm your account!');
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
                        />
                    </div>

                    {error && (
                        <div className={error.includes('Check your email') ? styles.success : styles.error}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
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
