'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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
    AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
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

    const [recentActivity, setRecentActivity] = useState<any[]>([
        // Mock data
        // { id: 1, type: 'cv_generated', title: 'Software Engineer CV', date: '2 hours ago' },
        // { id: 2, type: 'profile_updated', title: 'Updated Skills', date: '1 day ago' },
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Welcome back! 👋
                            </h1>
                            <p className="text-lg text-gray-600">
                                Ready to create your next job-winning CV?
                            </p>
                        </div>
                        <Link
                            href="/generate"
                            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Generate New CV</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {!isLoading && user && !user.emailVerified && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Your email is not verified. Some features may be restricted. Please <Link href="/auth/verify-email" className="font-medium underline hover:text-yellow-600">verify your email</Link>.
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
                            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className={`group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden ${action.featured ? 'md:col-span-1 ring-2 ring-purple-200' : ''
                                    }`}
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon and Badge */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-4 ${action.iconBg} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                            <action.icon className={`w-8 h-8 ${action.iconColor}`} />
                                        </div>
                                        {action.badge && (
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${action.badgeColor}`}>
                                                {action.badge}
                                            </span>
                                        )}
                                        {action.featured && (
                                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                                                ⚡ Popular
                                            </span>
                                        )}
                                    </div>

                                    {/* Title and Description */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-900">
                                        {action.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {action.description}
                                    </p>

                                    {/* Action Link */}
                                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                                        <span>{action.action}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Decorative Element */}
                                {action.featured && (
                                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500" />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity / Getting Started */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                            </div>
                            {recentActivity.length > 0 && (
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    View All
                                </button>
                            )}
                        </div>

                        {recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="p-2 bg-white rounded-lg">
                                            {activity.type === 'cv_generated' ? (
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <User className="w-5 h-5 text-purple-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{activity.title}</p>
                                            <p className="text-sm text-gray-600">{activity.date}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BarChart3 className="w-10 h-10 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No activity yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Start by creating your master CV profile or generating your first CV
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <Link
                                        href="/profile"
                                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        Edit Profile
                                    </Link>
                                    <Link
                                        href="/jobs"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Generate CV
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tips & Resources */}
                    <div className="space-y-6">
                        {/* Pro Tip Card */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Pro Tip</h3>
                            </div>
                            <p className="text-purple-100 text-sm leading-relaxed mb-4">
                                Complete your profile to 100% for the best AI-generated CVs. The more information you provide, the better results you'll get!
                            </p>
                            <Link
                                href="/profile"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-purple-100 transition-colors"
                            >
                                Complete Profile
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Resources Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="w-5 h-5 text-amber-600" />
                                <h3 className="font-bold text-lg text-gray-900">Resources</h3>
                            </div>
                            <div className="space-y-3">
                                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                                    <span className="text-sm font-medium text-gray-700">CV Writing Guide</span>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </a>
                                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                                    <span className="text-sm font-medium text-gray-700">Interview Tips</span>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </a>
                                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                                    <span className="text-sm font-medium text-gray-700">ATS Optimization</span>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}