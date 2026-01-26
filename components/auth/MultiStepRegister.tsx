'use client';

import React, { useState } from 'react';
import TermsOfService from './TermsOfService';
import styles from './MultiStepRegister.module.css';

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

// Sub-components for steps (defined here for simplicity first, can extract later)
// Step 1: Credentials
const CredentialsStep = ({ data, updateData }: { data: RegisterData, updateData: (d: Partial<RegisterData>) => void }) => (
    <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>Create Account</h2>
            <p className={styles.stepDescription}>Start your journey to financial freedom.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>First Name</label>
                    <input
                        type="text"
                        value={data.firstName}
                        onChange={(e) => updateData({ firstName: e.target.value })}
                        placeholder="John"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #ddd',
                            fontSize: '1rem'
                        }}
                        required
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Last Name</label>
                    <input
                        type="text"
                        value={data.lastName}
                        onChange={(e) => updateData({ lastName: e.target.value })}
                        placeholder="Doe"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #ddd',
                            fontSize: '1rem'
                        }}
                        required
                    />
                </div>
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Email</label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => updateData({ email: e.target.value })}
                    placeholder="you@example.com"
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                    required
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
                <input
                    type="password"
                    value={data.password}
                    onChange={(e) => updateData({ password: e.target.value as any })}
                    placeholder="Create a strong password"
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                    required
                    minLength={6}
                />
            </div>
        </div>
    </div>
);

// Step 2: Currency
import { CURRENCIES } from '@/lib/utils/currency';

const CurrencyStep = ({ data, updateData }: { data: RegisterData, updateData: (d: Partial<RegisterData>) => void }) => (
    <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>Choose Currency</h2>
            <p className={styles.stepDescription}>Select the primary currency for your finances.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label htmlFor="currency-select" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                Currency
            </label>
            <select
                id="currency-select"
                value={data.currency}
                onChange={(e) => updateData({ currency: e.target.value })}
                style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    color: '#1f2937'
                }}
            >
                {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.code} - {c.name} ({c.symbol})
                    </option>
                ))}
            </select>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
                You can change this later in settings.
            </p>
        </div>
    </div>
);

// Step 3: Review

const ReviewStep = ({ data, updateData, onShowTerms }: { data: RegisterData, updateData: (d: Partial<RegisterData>) => void, onShowTerms: () => void }) => (
    <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>Final Review</h2>
            <p className={styles.stepDescription}>Almost done! Please review your details.</p>
        </div>

        <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Name</span>
                <div style={{ fontWeight: 500, color: '#111827' }}>{data.firstName} {data.lastName}</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Account Email</span>
                <div style={{ fontWeight: 500, color: '#111827' }}>{data.email}</div>
            </div>
            <div>
                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Primary Currency</span>
                <div style={{ fontWeight: 500, color: '#111827' }}>{data.currency} ({CURRENCIES.find(c => c.code === data.currency)?.symbol})</div>
            </div>
        </div>

        <div className={styles.checkboxContainer} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
                type="checkbox"
                id="terms"
                checked={data.termsAccepted}
                onChange={(e) => updateData({ termsAccepted: e.target.checked })}
                style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.4 }}>
                I agree to the{' '}
                <button
                    type="button"
                    onClick={onShowTerms}
                    style={{ color: '#2563eb', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}
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

    const progress = ((step - 1) / 2) * 100;

    return (
        <div className={styles.wizardContainer}>
            <div className={styles.progressBarContainer}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
                    {/* Steps dots logic included conceptually in visual design above, simplifing here for cleaner code */}
                </div>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                </div>
                <div className={styles.stepsIndicator}>
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            className={`${styles.stepDot} ${s === step ? styles.activeDot : ''} ${s < step ? styles.completedDot : ''}`}
                        >
                            {s < step ? '✓' : s}
                        </div>
                    ))}
                </div>
            </div>

            {step === 1 && <CredentialsStep data={data} updateData={updateData} />}
            {step === 2 && <CurrencyStep data={data} updateData={updateData} />}
            {step === 3 && <ReviewStep data={data} updateData={updateData} onShowTerms={() => setShowTerms(true)} />}

            {error && <div style={{ color: '#ef4444', background: '#fee2e2', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</div>}

            <div className={styles.footer}>
                {step > 1 ? (
                    <button onClick={prevStep} className={styles.backButton} type="button">
                        Back
                    </button>
                ) : (
                    <button onClick={onLoginClick} className={styles.backButton} type="button" style={{ border: 'none', paddingLeft: 0, color: '#3b82f6' }}>
                        Login instead
                    </button>
                )}

                <button
                    onClick={nextStep}
                    className={styles.nextButton}
                    disabled={!isStepValid() || loading}
                    type="button"
                >
                    {loading ? 'Processing...' : (step === 3 ? 'Create Account' : 'Continue')}
                </button>
            </div>

            <TermsOfService isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </div>
    );
}
