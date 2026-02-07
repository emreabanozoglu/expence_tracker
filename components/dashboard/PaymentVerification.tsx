'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSubscription } from '@/lib/context/SubscriptionContext';
import toast from 'react-hot-toast';

export default function PaymentVerification() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { refreshSubscription } = useSubscription();
    const verificationInProgress = useRef<string | null>(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId && verificationInProgress.current !== sessionId) {
            verificationInProgress.current = sessionId;

            const verifyPayment = async () => {
                const loadingToast = toast.loading('Verifying payment...');
                try {
                    const res = await fetch('/api/stripe/verify-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId }),
                    });

                    const data = await res.json();

                    if (data.success) {
                        toast.success('Payment successful! You are now a Pro member.', { id: loadingToast });
                        // Refresh subscription to update UI immediately
                        await refreshSubscription();
                        // Remove session_id from URL without reload
                        router.replace('/');
                    } else {
                        toast.error('Payment verification failed.', { id: loadingToast });
                        verificationInProgress.current = null;
                    }
                } catch (error) {
                    console.error('Verification error:', error);
                    toast.error('Something went wrong verifying payment.', { id: loadingToast });
                    verificationInProgress.current = null;
                }
            };

            verifyPayment();
        }
    }, [searchParams, router, refreshSubscription]);

    return null;
}
