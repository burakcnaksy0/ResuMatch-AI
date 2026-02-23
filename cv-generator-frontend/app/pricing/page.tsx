'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { subscriptionApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import {
    Crown,
    Check,
    Sparkles,
    Zap,
    Shield,
    Clock,
    Users,
    TrendingUp,
    Star,
    Loader2
} from 'lucide-react';

export default function PricingPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { subscription, loading: subscriptionLoading, refetch } = useSubscription();
    const [pricing, setPricing] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState<string | null>(null);

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        try {
            const response = await subscriptionApi.getPricing();
            setPricing(response.data);
        } catch (error) {
            console.error('Failed to fetch pricing:', error);
            toast.error('Failed to load pricing information');
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (billingCycle: 'monthly' | 'yearly') => {
        if (!isAuthenticated) {
            toast.error('Please log in first');
            router.push('/auth/login');
            return;
        }

        setUpgrading(billingCycle);
        try {
            await subscriptionApi.upgrade(billingCycle);
            toast.success('Test Upgrade Successful! Redirecting...');
            await refetch();
            // Force full reload to ensure all contexts update
            window.location.href = '/profile';
        } catch (error: any) {
            console.error('Upgrade failed:', error);
            toast.error(error.response?.data?.message || 'Upgrade failed');
        } finally {
            setUpgrading(null);
        }
    };

    if (loading || subscriptionLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#10131a]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#3b82f6] animate-spin mx-auto mb-4" />
                    <p className="text-blue-200">Loading pricing information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#10131a] text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#232a36] rounded-full border border-[#3b82f6] mb-6">
                        <Sparkles className="w-4 h-4 text-[#3b82f6]" />
                        <span className="text-sm font-medium text-blue-200">Simple and Transparent Pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Take Your Career to the Next Level
                    </h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                        Choose the plan that best fits your needs and start creating AI-powered CVs
                    </p>
                </div>

                {/* Current Plan Banner */}
                {subscription && subscription.subscriptionType === 'PRO' && subscription.isActive && (
                    <div className="mb-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 border-2 border-amber-400">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <Crown className="w-8 h-8 text-white" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">You're a Pro Member!</h3>
                                    <p className="text-white/90">You have unlimited CV generation access</p>
                                </div>
                            </div>
                            {subscription.subscriptionEndDate && (
                                <div className="text-right">
                                    <p className="text-sm text-white/70">Subscription End Date</p>
                                    <p className="text-lg font-semibold text-white">
                                        {new Date(subscription.subscriptionEndDate).toLocaleDateString('en-US')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                    {/* Free Plan */}
                    <div className="bg-[#232a36] rounded-2xl border-2 border-[#232a36] p-8 hover:border-[#3b82f6] transition-all">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                            <p className="text-blue-200">Perfect to get started</p>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-white">$0</span>
                                <span className="text-blue-200">/forever</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {pricing?.free?.features?.map((feature: string, index: number) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                                    <span className="text-blue-200">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        {subscription?.subscriptionType === 'FREE' ? (
                            <button
                                disabled
                                className="w-full py-3 px-6 bg-[#181c24] text-blue-300 font-semibold rounded-xl cursor-not-allowed"
                            >
                                Current Plan
                            </button>
                        ) : (
                            <Link
                                href="/auth/register"
                                className="block w-full py-3 px-6 bg-[#181c24] hover:bg-[#232a36] text-white font-semibold rounded-xl text-center transition-colors"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gradient-to-br from-[#3b82f6] to-[#6366f1] rounded-2xl border-2 border-[#3b82f6] p-8 relative">
                        {/* Popular Badge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <div className="bg-amber-500 text-white text-sm font-bold px-6 py-1.5 rounded-full flex items-center gap-1.5">
                                <Star className="w-4 h-4" />
                                Most Popular
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Crown className="w-6 h-6 text-white" />
                                <h3 className="text-2xl font-bold text-white">Pro</h3>
                            </div>
                            <p className="text-blue-100">Unlimited possibilities</p>
                        </div>

                        {/* Pricing Options */}
                        <div className="space-y-4 mb-6">
                            {/* Monthly */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-semibold">Monthly</span>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white">${pricing?.pro?.monthly?.price}</div>
                                        <div className="text-sm text-blue-100">/ month</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleUpgrade('monthly')}
                                    disabled={upgrading !== null || (subscription?.subscriptionType === 'PRO' && subscription?.isActive)}
                                    className="w-full mt-3 py-2.5 px-6 bg-white text-[#3b82f6] font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {upgrading === 'monthly' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        subscription?.subscriptionType === 'PRO' && subscription?.isActive ? 'Active Plan' : 'Choose Monthly'
                                    )}
                                </button>
                            </div>

                            {/* Yearly */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-amber-400 relative">
                                <div className="absolute -top-3 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    33% Off
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-semibold">Yearly</span>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white">${pricing?.pro?.yearly?.price}</div>
                                        <div className="text-sm text-blue-100">/ year (${pricing?.pro?.yearly?.pricePerMonth}/mo)</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleUpgrade('yearly')}
                                    disabled={upgrading !== null || (subscription?.subscriptionType === 'PRO' && subscription?.isActive)}
                                    className="w-full mt-3 py-2.5 px-6 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {upgrading === 'yearly' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        subscription?.subscriptionType === 'PRO' && subscription?.isActive ? 'Active Plan' : 'Choose Yearly (Best Value)'
                                    )}
                                </button>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {pricing?.pro?.features?.map((feature: string, index: number) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                                    <span className="text-white">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Features Comparison */}
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Why Pro?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-[#232a36] rounded-xl p-6 border border-[#232a36]">
                            <div className="w-12 h-12 bg-[#181c24] rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-[#3b82f6]" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Unlimited Generation</h3>
                            <p className="text-blue-200 text-sm">
                                Create as many CVs as you want, customize for every job application
                            </p>
                        </div>
                        <div className="bg-[#232a36] rounded-xl p-6 border border-[#232a36]">
                            <div className="w-12 h-12 bg-[#181c24] rounded-xl flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-[#6366f1]" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Priority Processing</h3>
                            <p className="text-blue-200 text-sm">
                                Priority in AI processing queue, faster results
                            </p>
                        </div>
                        <div className="bg-[#232a36] rounded-xl p-6 border border-[#232a36]">
                            <div className="w-12 h-12 bg-[#181c24] rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-[#a21caf]" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Premium Support</h3>
                            <p className="text-blue-200 text-sm">
                                Priority customer support and personalized assistance
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <details className="bg-[#232a36] rounded-xl p-6 border border-[#232a36] group">
                            <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                                How many CVs can I create on the Free plan?
                                <span className="text-[#3b82f6] group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-blue-200 mt-4">
                                On the Free plan, you can create a total of 3 job-based CVs and 1 profile-based CV. These are total limits, not monthly.
                            </p>
                        </details>
                        <details className="bg-[#232a36] rounded-xl p-6 border border-[#232a36] group">
                            <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                                Can I cancel my Pro plan anytime?
                                <span className="text-[#3b82f6] group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-blue-200 mt-4">
                                Yes, you can cancel anytime. You'll continue to have Pro features until the end of your current billing period.
                            </p>
                        </details>
                        <details className="bg-[#232a36] rounded-xl p-6 border border-[#232a36] group">
                            <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                                Is the yearly plan more beneficial?
                                <span className="text-[#3b82f6] group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-blue-200 mt-4">
                                Yes! With the yearly plan, you pay $8.25/month, saving 33% compared to the monthly plan ($81 annual savings).
                            </p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}
