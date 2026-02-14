'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscriptionApi } from '@/lib/api/client';
import { useAuth } from './AuthContext';

interface SubscriptionUsage {
    jobBasedCVs: {
        used: number;
        limit: number | null;
        remaining: number | null;
    };
    profileBasedCVs: {
        used: number;
        limit: number | null;
        remaining: number | null;
    };
}

interface SubscriptionStatus {
    subscriptionType: 'FREE' | 'PRO';
    isActive: boolean;
    subscriptionStartDate: string | null;
    subscriptionEndDate: string | null;
    usage: SubscriptionUsage;
}

interface SubscriptionContextType {
    subscription: SubscriptionStatus | null;
    loading: boolean;
    refetch: () => Promise<void>;
    canGenerateJobBasedCV: () => boolean;
    canGenerateProfileBasedCV: () => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSubscription = async () => {
        if (!isAuthenticated) {
            setSubscription(null);
            setLoading(false);
            return;
        }

        try {
            const response = await subscriptionApi.getStatus();
            setSubscription(response.data);
        } catch (error) {
            console.error('Failed to fetch subscription status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, [isAuthenticated]);

    const canGenerateJobBasedCV = () => {
        if (!subscription) return false;
        if (subscription.subscriptionType === 'PRO' && subscription.isActive) return true;
        return (subscription.usage.jobBasedCVs.remaining ?? 0) > 0;
    };

    const canGenerateProfileBasedCV = () => {
        if (!subscription) return false;
        if (subscription.subscriptionType === 'PRO' && subscription.isActive) return true;
        return (subscription.usage.profileBasedCVs.remaining ?? 0) > 0;
    };

    return (
        <SubscriptionContext.Provider
            value={{
                subscription,
                loading,
                refetch: fetchSubscription,
                canGenerateJobBasedCV,
                canGenerateProfileBasedCV,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
}
