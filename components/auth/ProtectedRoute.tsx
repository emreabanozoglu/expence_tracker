// Protected Route Wrapper - Redirects to auth if not logged in

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontSize: '1.5rem',
                color: 'var(--gray-400)'
            }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
