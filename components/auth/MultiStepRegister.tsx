'use client';

import React, { useState } from 'react';
import TermsOfService from './TermsOfService';
import { CURRENCIES } from '@/lib/utils/currency';

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    currency: string;
    termsAccepted: boolean;
}

interface MultiStepRegisterProps {
    onComplete: (data: RegisterData) => void;
    onLoginClick: () => void;
    loading?: boolean;
    error?: string;
}

// Sub-components for steps
// Step 1: Credentials
const CredentialsStep = ({ data, updateData }: { data: RegisterData, updateData: (d: Partial<RegisterData>) => void }) => (
    <div className="animate-[slideIn_0.4s_ease-out_forwards]">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-base-content">Create Account</h2>
            <p className="text-base-content/60 text-sm">Start your journey to financial freedom.</p>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block mb-2 font-semibold text-sm text-base-content">First Name</label>
                    <input
                        type="text"
                        value={data.firstName}
                        onChange={(e) => updateData({ firstName: e.target.value })}
                        placeholder="John"
                        className="input input-bordered w-full text-base"
                        required
                        data-testid="signup-firstname-input"
                    />
                </div>
                <div className="flex-1">
                    <label className="block mb-2 font-semibold text-sm text-base-content">Last Name</label>
                    <input
                        type="text"
                        value={data.lastName}
                        onChange={(e) => updateData({ lastName: e.target.value })}
                        placeholder="Doe"
                        className="input input-bordered w-full text-base"
                        required
                        data-testid="signup-lastname-input"
                    />
                </div>
            </div>
            <div>
                <label className="block mb-2 font-semibold text-sm text-base-content">Email</label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => updateData({ email: e.target.value })}
                    placeholder="you@example.com"
                    className="input input-bordered w-full text-base"
                    required
                    data-testid="signup-email-input"
                />
            </div>
            <div>
                <label className="block mb-2 font-semibold text-sm text-base-content">Password</label>
                <input
                    type="password"
                    value={data.password}
                    onChange={(e) => updateData({ password: e.target.value })}
                    placeholder="Create a strong password"
                    className="input input-bordered w-full text-base"
                    required
                    minLength={6}
                    data-testid="signup-password-input"
                />
            </div>
        </div>
    </div>
);

// Step 2: Currency
const CurrencyStep = ({ data, updateData }: { data: RegisterData, updateData: (d: Partial<RegisterData>) => void }) => (
    <div className="animate-[slideIn_0.4s_ease-out_forwards]">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-base-content">Choose Currency</h2>
            <p className="text-base-content/60 text-sm">Select the primary currency for your finances.</p>
        </div>

        <div className="flex flex-col gap-4">
            <label htmlFor="currency-select" className="font-semibold text-sm text-base-content">
                Currency
            </label>
            <select
                id="currency-select"
                value={data.currency}
                onChange={(e) => updateData({ currency: e.target.value })}
                className="select select-bordered w-full text-base bg-base-100 text-base-content"
                data-testid="signup-currency-select"
            >
                {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.code} - {c.name} ({c.symbol})
                    </option>
                ))}
            </select>
            <p className="text-xs text-base-content/60 mt-1">
                You can change this later in settings.
            </p>
        </div>
    </div>
);

// Step 3: Review
const ReviewStep = ({ data, updateData, onShowTerms }: { data: RegisterData, updateData: (d: Partial<RegisterData>) => void, onShowTerms: () => void }) => (
    <div className="animate-[slideIn_0.4s_ease-out_forwards]">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-base-content">Final Review</h2>
            <p className="text-base-content/60 text-sm">Almost done! Please review your details.</p>
        </div>

        <div className="bg-base-200/50 p-6 rounded-xl mb-6">
            <div className="mb-4">
                <span className="text-base-content/60 text-sm block mb-1">Name</span>
                <div className="font-medium text-base-content">{data.firstName} {data.lastName}</div>
            </div>
            <div className="mb-4">
                <span className="text-base-content/60 text-sm block mb-1">Account Email</span>
                <div className="font-medium text-base-content">{data.email}</div>
            </div>
            <div>
                <span className="text-base-content/60 text-sm block mb-1">Primary Currency</span>
                <div className="font-medium text-base-content">{data.currency} ({CURRENCIES.find(c => c.code === data.currency)?.symbol})</div>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                id="terms"
                checked={data.termsAccepted}
                onChange={(e) => updateData({ termsAccepted: e.target.checked })}
                className="checkbox checkbox-primary"
                data-testid="signup-terms-checkbox"
            />
            <label htmlFor="terms" className="text-sm text-base-content leading-snug cursor-pointer select-none">
                I agree to the{' '}
                <button
                    type="button"
                    onClick={onShowTerms}
                    className="link link-primary inline-block font-medium hover:underline focus:outline-none"
                >
                    Terms and Conditions
                </button>
            </label>
        </div>
    </div>
);

export default function MultiStepRegister({ onComplete, onLoginClick, loading, error }: MultiStepRegisterProps) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<RegisterData>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        currency: 'USD',
        termsAccepted: false,
    });
    const [showTerms, setShowTerms] = useState(false);

    const updateData = (newData: Partial<RegisterData>) => {
        setData(prev => ({ ...prev, ...newData }));
    };

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else onComplete(data);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const isStepValid = () => {
        if (step === 1) return data.email.includes('@') && data.password.length >= 6 && data.firstName.length > 0 && data.lastName.length > 0;
        if (step === 2) return !!data.currency;
        if (step === 3) return data.termsAccepted;
        return false;
    };

    return (
        <div className="w-full relative pb-8">
            <div className="mb-10 relative px-2.5">
                <ul className="steps w-full">
                    {[1, 2, 3].map(s => (
                        <li
                            key={s}
                            className={`step ${s <= step ? 'step-primary' : ''} text-xs md:text-sm font-medium transition-all duration-300`}
                            data-content={s < step ? '✓' : s}
                        >
                            {s === 1 ? 'Details' : s === 2 ? 'Currency' : 'Review'}
                        </li>
                    ))}
                </ul>
            </div>

            {step === 1 && <CredentialsStep data={data} updateData={updateData} />}
            {step === 2 && <CurrencyStep data={data} updateData={updateData} />}
            {step === 3 && <ReviewStep data={data} updateData={updateData} onShowTerms={() => setShowTerms(true)} />}

            {error && <div className="text-error bg-error/10 p-3 rounded-lg mt-4 text-sm font-medium">{error}</div>}

            <div className="flex justify-between mt-8 gap-4">
                {step > 1 ? (
                    <button onClick={prevStep} className="btn btn-outline" type="button">
                        Back
                    </button>
                ) : (
                    <button onClick={onLoginClick} className="btn btn-ghost text-primary hover:bg-transparent px-0 normal-case" type="button" data-testid="auth-toggle-button">
                        Login instead
                    </button>
                )}

                <button
                    onClick={nextStep}
                    className="btn btn-primary flex-1 gap-2"
                    disabled={!isStepValid() || loading}
                    type="button"
                    data-testid="signup-submit-button"
                >
                    {loading && <span className="loading loading-spinner loading-sm"></span>}
                    {loading ? 'Processing...' : (step === 3 ? 'Create Account' : 'Continue')}
                </button>
            </div>

            <TermsOfService isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </div>
    );
}
