'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabase/client';

type SubscriptionContextType = {
    isPro: boolean;
    isLoading: boolean;
    subscription: any | null; // Replace 'any' with Profile type if available
    checkLimit: (count: number) => boolean;
    isPricingModalOpen: boolean;
    openPricingModal: () => void;
    closePricingModal: () => void;
    refreshSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType>({
    isPro: false,
    isLoading: true,
    subscription: null,
    checkLimit: () => false,
    isPricingModalOpen: false,
    openPricingModal: () => { },
    closePricingModal: () => { },
    refreshSubscription: async () => { },
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [isPro, setIsPro] = useState(false);
    const [subscription, setSubscription] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

    const openPricingModal = () => setIsPricingModalOpen(true);
    const closePricingModal = () => setIsPricingModalOpen(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            if (!user) {
                setIsPro(false);
                setSubscription(null);
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching subscription:', error);
                }

                if (data) {
                    setIsPro(data.is_pro || false);
                    setSubscription(data);
                }
            } catch (error) {
                console.error('Error in fetchSubscription:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscription();

        // Subscribe to changes
        const channel = supabase
            .channel('profile_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user?.id}`,
                },
                (payload) => {
                    if (payload.new) {
                        const newProfile = payload.new as any;
                        setIsPro(newProfile.is_pro || false);
                        setSubscription(newProfile);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const checkLimit = (currentCount: number) => {
        console.log('Checking limit:', { isPro, currentCount, limit: 10 });
        if (isPro) return true;
        return currentCount < 10;
    };

    const refreshSubscription = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setIsPro(data.is_pro || false);
                setSubscription(data);
            }
        } catch (error) {
            console.error('Error refreshing subscription:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SubscriptionContext.Provider value={{ isPro, isLoading, subscription, checkLimit, isPricingModalOpen, openPricingModal, closePricingModal, refreshSubscription }}>
            {children}
        </SubscriptionContext.Provider>
    );
};
