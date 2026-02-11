// Auth Page Component - Login and Sign Up

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import TermsOfService from '@/components/auth/TermsOfService';
import MultiStepRegister from '@/components/auth/MultiStepRegister';

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
        <div className="min-h-screen w-full flex bg-base-100 overflow-hidden">
            {/* Left Side: Brand Section */}
            <div className="hidden lg:flex flex-1 flex-col justify-center p-16 relative overflow-hidden bg-gradient-to-br from-primary to-primary-focus text-primary-content">
                {/* Decorative Blobs */}
                <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4f46e5] rounded-full blur-[80px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#ec4899] rounded-full blur-[80px] opacity-40 animate-pulse delay-700"></div>

                <div className="relative z-10 max-w-xl">
                    <h1 className="text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        Master your<br />Finances today.
                    </h1>
                    <p className="text-xl opacity-90 leading-relaxed max-w-lg">
                        Track expenses, manage budgets, and achieve your financial goals with ease.
                        Join thousands of users taking control of their money.
                    </p>

                    {!isSignUp && (
                        <div className="grid grid-cols-2 gap-8 mt-16">
                            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                <h3 className="text-lg font-bold flex items-center gap-2">📊 Smart Analytics</h3>
                                <p className="opacity-80">Visualize your spending habits with intuitive charts.</p>
                            </div>
                            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <h3 className="text-lg font-bold flex items-center gap-2">🌍 Multi-Currency</h3>
                                <p className="opacity-80">Support for all major world currencies.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Form Section */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="w-full max-w-md p-8 bg-base-100 lg:border lg:border-base-200 lg:rounded-2xl lg:shadow-xl animate-fade-in">
                    <div className="mb-8 text-left">
                        <h2 className="text-3xl font-bold text-base-content mb-2">
                            {isSignUp ? 'Create an account' : 'Welcome back'}
                        </h2>
                        <p className="text-base-content/60 text-base">
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
                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-semibold text-base-content">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input input-bordered w-full focus:input-primary"
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="email"
                                    data-testid="email-input"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" className="text-sm font-semibold text-base-content">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input input-bordered w-full focus:input-primary"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    autoComplete="current-password"
                                    data-testid="password-input"
                                />
                            </div>

                            {error && (
                                <div
                                    className={`alert ${error.includes('Check your email') ? 'alert-success' : 'alert-error'} text-sm py-2`}
                                    data-testid="auth-error-message"
                                >
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-4"
                                disabled={loading}
                                data-testid="auth-submit-button"
                            >
                                {loading && <span className="loading loading-spinner loading-xs"></span>}
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div className="mt-8 text-center text-sm text-base-content/60">
                                Don't have an account?
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(true)}
                                    className="btn btn-link btn-sm p-0 ml-1 text-primary no-underline hover:underline"
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
