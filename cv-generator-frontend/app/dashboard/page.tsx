'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
    User,
    FileText,
    Sparkles,
    TrendingUp,
    Clock,
    CheckCircle,
    ArrowRight,
    Plus,
    Download,
    Eye,
    Zap,
    Target,
    Award,
    BarChart3,
    AlertCircle,
    Crown,
    Rocket
} from 'lucide-react';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const { subscription, loading: subscriptionLoading } = useSubscription();
    const router = useRouter();

    // Removed automatic redirect for unverified users per user request
    // Verification can be done via Profile -> Security

    // Mock data - replace with real API calls
    const [stats, setStats] = useState({
        totalCVs: 0,
        profileCompletion: 0,
        recentCVs: 0,
        successRate: 0
    });

    const [recentCVs, setRecentCVs] = useState<any[]>([
        // Mock data - bu gerçek API'den gelecek
        {
            id: 1,
            jobTitle: 'Senior Frontend Developer',
            company: 'TechCorp Inc.',
            createdAt: '2 saat önce',
            status: 'active',
            views: 12
        },
        {
            id: 2,
            jobTitle: 'Full Stack Engineer',
            company: 'StartupXYZ',
            createdAt: '1 gün önce',
            status: 'downloaded',
            views: 5
        },
        {
            id: 3,
            jobTitle: 'React Developer',
            company: 'Digital Agency',
            createdAt: '3 gün önce',
            status: 'active',
            views: 8
        },
    ]);

    const quickActions = [
        {
            title: 'Master CV Profile',
            description: 'Build your comprehensive CV profile with all your experience and skills',
            icon: User,
            href: '/profile',
            color: 'from-blue-500 to-indigo-500',
            bgColor: 'from-blue-50 to-indigo-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            action: 'Edit Profile',
            badge: stats.profileCompletion < 100 ? `${stats.profileCompletion}% Complete` : 'Complete',
            badgeColor: stats.profileCompletion < 100 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
        },
        {
            title: 'Generate New CV',
            description: 'Create a job-specific CV tailored to your target position using AI',
            icon: Sparkles,
            href: '/jobs',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'from-purple-50 to-pink-50',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            action: 'Generate Now',
            featured: true
        },
        {
            title: 'My Generated CVs',
            description: 'View, download, and manage all your previously generated CVs',
            icon: FileText,
            href: '/cvs',
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'from-emerald-50 to-teal-50',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            action: 'View All CVs',
            badge: stats.totalCVs > 0 ? `${stats.totalCVs} CVs` : null,
            badgeColor: 'bg-emerald-100 text-emerald-700'
        },
    ];

    const statsCards = [
        {
            label: 'Total CVs',
            value: stats.totalCVs,
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            trend: '+12%',
            trendUp: true
        },
        {
            label: 'Profile Score',
            value: `${stats.profileCompletion}%`,
            icon: Target,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            trend: 'Complete',
            trendUp: true
        },
        {
            label: 'This Month',
            value: stats.recentCVs,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            trend: 'Active',
            trendUp: true
        },
        {
            label: 'Success Rate',
            value: `${stats.successRate}%`,
            icon: Award,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            trend: 'High',
            trendUp: true
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#10131a] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Tekrar hoş geldin! 👋
                            </h1>
                            <p className="text-lg text-blue-200">
                                Bir sonraki iş kazandıran CV'ni oluşturmaya hazır mısın?
                            </p>
                        </div>
                        <Link
                            href="/generate"
                            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white font-semibold rounded-xl hover:from-[#2563eb] hover:to-[#4f46e5] transition-all duration-200 shadow-lg shadow-blue-900 hover:shadow-xl hover:shadow-blue-800"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Yeni CV Oluştur</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {!isLoading && user && !user.emailVerified && (
                        <div className="bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-200">
                                        E-posta adresin doğrulanmadı. Bazı özellikler kısıtlanmış olabilir. Lütfen <Link href="/auth/verify-email" className="font-medium underline hover:text-yellow-300">e-postanı doğrula</Link>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-[#232a36] rounded-2xl p-6 border border-[#232a36] hover:border-[#3b82f6] hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 bg-[#181c24] rounded-xl`}>
                                    <stat.icon className={`w-6 h-6 text-[#3b82f6]`} />
                                </div>
                                <div className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                                    }`}>
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-blue-200">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Hızlı İşlemler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className={`group relative bg-[#232a36] rounded-2xl p-8 border-2 border-[#232a36] hover:border-[#3b82f6] hover:shadow-2xl transition-all duration-300 overflow-hidden ${action.featured ? 'md:col-span-1 ring-2 ring-[#6366f1]' : ''}
                                    }`}
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon and Badge */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-4 bg-[#181c24] rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                            <action.icon className={`w-8 h-8 text-[#3b82f6]`} />
                                        </div>
                                        {action.badge && (
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-blue-900/30 text-blue-200`}>
                                                {action.badge}
                                            </span>
                                        )}
                                        {action.featured && (
                                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#6366f1] text-white">
                                                ⚡ Popüler
                                            </span>
                                        )}
                                    </div>

                                    {/* Title and Description */}
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white">
                                        {action.title}
                                    </h3>
                                    <p className="text-blue-200 mb-6 leading-relaxed">
                                        {action.description}
                                    </p>

                                    {/* Action Link */}
                                    <div className="flex items-center gap-2 text-[#3b82f6] font-semibold group-hover:gap-3 transition-all">
                                        <span>{action.action}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Decorative Element */}
                                {action.featured && (
                                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-[#6366f1] to-[#3b82f6] rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500" />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent CVs / Getting Started */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent CVs */}
                    <div className="lg:col-span-2 bg-[#232a36] rounded-2xl border border-[#232a36] p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#181c24] rounded-lg">
                                    <FileText className="w-5 h-5 text-[#3b82f6]" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Son CV'lerim</h2>
                            </div>
                            {recentCVs.length > 0 && (
                                <Link href="/cvs" className="text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium flex items-center gap-1">
                                    Tümünü Gör
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>

                        {recentCVs.length > 0 ? (
                            <div className="space-y-3">
                                {recentCVs.map((cv) => (
                                    <Link
                                        key={cv.id}
                                        href={`/cvs/${cv.id}`}
                                        className="group flex items-center gap-4 p-5 bg-[#181c24] rounded-xl hover:bg-[#232a36] hover:border hover:border-[#3b82f6] transition-all duration-200"
                                    >
                                        <div className="p-3 bg-[#232a36] group-hover:bg-[#3b82f6] rounded-lg transition-colors">
                                            <FileText className="w-6 h-6 text-[#3b82f6] group-hover:text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white text-base mb-1 truncate">{cv.jobTitle}</p>
                                            <div className="flex items-center gap-3 text-sm text-blue-200">
                                                <span className="truncate">{cv.company}</span>
                                                <span className="text-blue-300">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {cv.views} görüntülenme
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                                cv.status === 'downloaded'
                                                    ? 'bg-green-900/30 text-green-300'
                                                    : 'bg-blue-900/30 text-blue-300'
                                            }`}>
                                                {cv.status === 'downloaded' ? (
                                                    <span className="flex items-center gap-1">
                                                        <Download className="w-3 h-3" />
                                                        İndirildi
                                                    </span>
                                                ) : (
                                                    'Aktif'
                                                )}
                                            </span>
                                            <span className="text-xs text-blue-300">{cv.createdAt}</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-blue-300 group-hover:text-[#3b82f6] group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#6366f1] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Henüz CV oluşturmadın
                                </h3>
                                <p className="text-blue-200 mb-6">
                                    İlk CV'ni oluşturarak başla ve hayalindeki işe bir adım daha yaklaş
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <Link
                                        href="/profile"
                                        className="px-4 py-2 text-sm font-medium text-[#3b82f6] bg-[#181c24] rounded-lg hover:bg-[#232a36] transition-colors"
                                    >
                                        Profili Düzenle
                                    </Link>
                                    <Link
                                        href="/jobs"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#3b82f6] to-[#6366f1] rounded-lg hover:from-[#2563eb] hover:to-[#4f46e5] transition-all"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        CV Oluştur
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tips & Resources */}
                    <div className="space-y-6">
                        {/* Subscription Status Card */}
                        {!subscriptionLoading && subscription && (
                            <div className={`rounded-2xl p-6 border-2 ${
                                subscription.subscriptionType === 'PRO' && subscription.isActive
                                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-400'
                                    : 'bg-[#232a36] border-[#232a36]'
                            }`}>
                                <div className="flex items-center gap-2 mb-4">
                                    {subscription.subscriptionType === 'PRO' && subscription.isActive ? (
                                        <>
                                            <Crown className="w-5 h-5 text-white" />
                                            <h3 className="font-bold text-lg text-white">Pro Üye</h3>
                                        </>
                                    ) : (
                                        <>
                                            <Rocket className="w-5 h-5 text-[#3b82f6]" />
                                            <h3 className="font-bold text-lg text-white">Free Plan</h3>
                                        </>
                                    )}
                                </div>

                                {subscription.subscriptionType === 'PRO' && subscription.isActive ? (
                                    <div>
                                        <p className="text-white/90 text-sm mb-4">
                                            Sınırsız CV oluşturma hakkına sahipsin!
                                        </p>
                                        {subscription.subscriptionEndDate && (
                                            <p className="text-xs text-white/70">
                                                Bitiş: {new Date(subscription.subscriptionEndDate).toLocaleDateString('tr-TR')}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="space-y-3 mb-4">
                                            <div className="bg-[#181c24] rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-blue-200">İş bazlı CV</span>
                                                    <span className="text-sm font-semibold text-white">
                                                        {subscription.usage.jobBasedCVs.remaining} / {subscription.usage.jobBasedCVs.limit} kaldı
                                                    </span>
                                                </div>
                                                <div className="w-full bg-[#232a36] rounded-full h-2">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            (subscription.usage.jobBasedCVs.remaining ?? 0) === 0
                                                                ? 'bg-red-500'
                                                                : 'bg-blue-500'
                                                        }`}
                                                        style={{
                                                            width: `${((subscription.usage.jobBasedCVs.remaining ?? 0) / (subscription.usage.jobBasedCVs.limit ?? 1)) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-[#181c24] rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-blue-200">Profil bazlı CV</span>
                                                    <span className="text-sm font-semibold text-white">
                                                        {subscription.usage.profileBasedCVs.remaining} / {subscription.usage.profileBasedCVs.limit} kaldı
                                                    </span>
                                                </div>
                                                <div className="w-full bg-[#232a36] rounded-full h-2">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            (subscription.usage.profileBasedCVs.remaining ?? 0) === 0
                                                                ? 'bg-red-500'
                                                                : 'bg-purple-500'
                                                        }`}
                                                        style={{
                                                            width: `${((subscription.usage.profileBasedCVs.remaining ?? 0) / (subscription.usage.profileBasedCVs.limit ?? 1)) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href="/pricing"
                                            className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white text-sm font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#4f46e5] transition-all"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <Crown className="w-4 h-4" />
                                                Pro'ya Yükselt
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pro Tip Card */}
                        <div className="bg-gradient-to-br from-[#6366f1] to-[#3b82f6] rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Pro Tip</h3>
                            </div>
                            <p className="text-blue-100 text-sm leading-relaxed mb-4">
                                Profilini %100 tamamla, en iyi AI destekli CV'leri elde et. Ne kadar çok bilgi verirsen, sonuçlar o kadar iyi olur!
                            </p>
                            <Link
                                href="/profile"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-100 transition-colors"
                            >
                                Profili Tamamla
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Resources Card */}
                        <div className="bg-[#232a36] rounded-2xl border border-[#232a36] p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="w-5 h-5 text-yellow-400" />
                                <h3 className="font-bold text-lg text-white">Kaynaklar</h3>
                            </div>
                            <div className="space-y-3">
                                <a href="#" className="flex items-center justify-between p-3 bg-[#181c24] rounded-lg hover:bg-[#232a36] transition-colors group">
                                    <span className="text-sm font-medium text-blue-200">CV Hazırlama Rehberi</span>
                                    <ArrowRight className="w-4 h-4 text-blue-200 group-hover:text-white" />
                                </a>
                                <a href="#" className="flex items-center justify-between p-3 bg-[#181c24] rounded-lg hover:bg-[#232a36] transition-colors group">
                                    <span className="text-sm font-medium text-blue-200">Mülakat Tüyoları</span>
                                    <ArrowRight className="w-4 h-4 text-blue-200 group-hover:text-white" />
                                </a>
                                <a href="#" className="flex items-center justify-between p-3 bg-[#181c24] rounded-lg hover:bg-[#232a36] transition-colors group">
                                    <span className="text-sm font-medium text-blue-200">ATS Optimizasyonu</span>
                                    <ArrowRight className="w-4 h-4 text-blue-200 group-hover:text-white" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}