'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileApi } from '@/lib/api/client';
import ProfileForm from '@/components/forms/ProfileForm';
import EducationList from '@/components/forms/EducationList';
import WorkExperienceList from '@/components/forms/WorkExperienceList';
import SkillList from '@/components/forms/SkillList';
import ProjectList from '@/components/forms/ProjectList';
import CertificationList from '@/components/forms/CertificationList';
import LanguageList from '@/components/forms/LanguageList';
import SecuritySettings from '@/components/forms/SecuritySettings';
import toast from 'react-hot-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
    User,
    GraduationCap,
    Briefcase,
    Code,
    FolderKanban,
    Award,
    Languages,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Shield,
    Crown
} from 'lucide-react';

export default function ProfilePage() {
    const { isAuthenticated } = useAuth();
    const { subscription } = useSubscription();
    const [activeTab, setActiveTab] = useState('personal');
    const [profile, setProfile] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const isPro = subscription?.subscriptionType === 'PRO' && subscription?.isActive;

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated]);

    const fetchProfile = async () => {
        try {
            const res = await profileApi.getMe();
            setProfile(res.data);
        } catch (err: any) {
            // 404 is expected if profile doesn't exist yet
            if (err.response?.status !== 404) {
                console.error('Failed to fetch profile', err);
                toast.error('Failed to load profile');
            }
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleProfileSuccess = () => {
        fetchProfile(); // Refresh profile data
    };

    const tabs = [
        {
            id: 'personal',
            label: 'Personal Info',
            icon: User,
            description: 'Basic information and contact details'
        },
        {
            id: 'education',
            label: 'Education',
            icon: GraduationCap,
            description: 'Your academic background'
        },
        {
            id: 'experience',
            label: 'Experience',
            icon: Briefcase,
            description: 'Work history and achievements'
        },
        {
            id: 'skills',
            label: 'Skills',
            icon: Code,
            description: 'Technical and soft skills'
        },
        {
            id: 'projects',
            label: 'Projects',
            icon: FolderKanban,
            description: 'Portfolio and projects'
        },
        {
            id: 'certifications',
            label: 'Certifications',
            icon: Award,
            description: 'Professional certifications'
        },
        {
            id: 'languages',
            label: 'Languages',
            icon: Languages,
            description: 'Language proficiency'
        },
        {
            id: 'security',
            label: 'Security',
            icon: Shield,
            description: 'Password and account security'
        },
    ];

    // Use backend calculated completion
    const completion = profile?.completeness?.total || 0;
    const suggestions = profile?.completeness?.suggestions || [];

    if (loadingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#10131a]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mb-4"></div>
                    <p className="text-blue-200 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#10131a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-gradient-to-br from-[#3b82f6] to-[#6366f1] rounded-xl">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">
                                    Master CV Profile
                                </h1>
                            </div>
                            <p className="text-lg text-blue-200 max-w-2xl">
                                Build your comprehensive CV profile. This information will be used to generate tailored, job-specific CVs with AI.
                            </p>
                        </div>

                        {/* Profile Completion Card */}
                        <div className="bg-[#232a36] rounded-2xl border border-[#232a36] p-6 shadow-sm min-w-[280px]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-blue-200">Profile Completion</span>
                                <span className="text-2xl font-bold text-white">{completion}%</span>
                            </div>
                            <div className="w-full bg-[#181c24] rounded-full h-3 mb-3 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${completion === 100
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                        }`}
                                    style={{ width: `${completion}%` }}
                                />
                            </div>
                            {completion === 100 ? (
                                <div className="flex items-center gap-2 text-sm text-green-300">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="font-medium">Profile Complete!</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-amber-300">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="font-medium">
                                        {completion < 50 ? 'Let\'s get started' : 'Almost there!'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Subscription Plan Card */}
                        <div className="bg-[#232a36] rounded-2xl border border-[#232a36] p-6 shadow-sm min-w-[200px]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-200">Current Plan</span>
                                <div className={`p-2 rounded-lg ${isPro ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20' : 'bg-gray-700/30'}`}>
                                    {isPro ? <Crown className="w-5 h-5 text-amber-500" /> : <Shield className="w-5 h-5 text-gray-400" />}
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className={`text-3xl font-bold ${isPro ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400' : 'text-white'}`}>
                                    {isPro ? 'PRO' : 'FREE'}
                                </span>
                                <p className="text-xs text-blue-200 mt-1">
                                    {isPro ? 'Premium Access Unlocked' : 'Basic Access'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    {completion < 100 && (
                        <div className="mt-6 bg-[#232a36] border border-[#3b82f6] rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-white mb-2">
                                        Improve your profile strength
                                    </h3>
                                    <div className="space-y-1">
                                        {suggestions.length > 0 ? (
                                            suggestions.map((msg: string, idx: number) => (
                                                <p key={idx} className="text-sm text-blue-200 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full" />
                                                    {msg}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-sm text-blue-200">
                                                The more information you provide, the better our AI can tailor your CVs.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Card */}
                <div className="bg-[#232a36] rounded-2xl shadow-lg border border-[#232a36] overflow-hidden">
                    {/* Desktop Tabs */}
                    <div className="hidden lg:block border-b border-[#181c24] bg-[#181c24]">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            group relative flex items-center gap-3 px-6 py-4 text-sm font-medium whitespace-nowrap
                                            transition-all duration-200
                                            ${activeTab === tab.id
                                                ? 'text-[#3b82f6] bg-[#232a36]'
                                                : 'text-blue-200 hover:text-white hover:bg-[#232a36]'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#3b82f6]' : 'text-blue-300 group-hover:text-blue-200'}`} />
                                        <span>{tab.label}</span>
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3b82f6] to-[#6366f1]" />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Mobile Tabs - Grid Layout */}
                    <div className="lg:hidden border-b border-[#181c24] bg-[#181c24] p-4">
                        <div className="grid grid-cols-2 gap-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex flex-col items-center gap-2 p-3 rounded-xl text-xs font-medium
                                            transition-all duration-200
                                            ${activeTab === tab.id
                                                ? 'bg-[#232a36] text-[#3b82f6] shadow-sm border border-[#3b82f6]'
                                                : 'text-blue-200 hover:bg-[#232a36]'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#3b82f6]' : 'text-blue-300'}`} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 md:p-8">
                        {/* Active Tab Header */}
                        <div className="mb-6 pb-6 border-b border-[#181c24]">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#181c24] rounded-xl">
                                    {(() => {
                                        const Icon = tabs.find(t => t.id === activeTab)?.icon || User;
                                        return <Icon className="w-6 h-6 text-[#3b82f6]" />;
                                    })()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {tabs.find(t => t.id === activeTab)?.label}
                                    </h2>
                                    <p className="text-blue-200">
                                        {tabs.find(t => t.id === activeTab)?.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="space-y-6">
                            {activeTab === 'personal' && (
                                <ProfileForm
                                    initialData={profile}
                                    profileId={profile?.id}
                                    onSuccess={handleProfileSuccess}
                                />
                            )}

                            {activeTab === 'education' && (
                                <EducationList profileId={profile?.id || ''} />
                            )}

                            {activeTab === 'experience' && (
                                <WorkExperienceList profileId={profile?.id || ''} />
                            )}

                            {activeTab === 'skills' && (
                                <SkillList profileId={profile?.id || ''} />
                            )}

                            {activeTab === 'projects' && (
                                <ProjectList profileId={profile?.id || ''} />
                            )}

                            {activeTab === 'certifications' && (
                                <CertificationList profileId={profile?.id || ''} />
                            )}

                            {activeTab === 'languages' && (
                                <LanguageList profileId={profile?.id || ''} />
                            )}

                            {activeTab === 'security' && (
                                <SecuritySettings />
                            )}
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="bg-[#232a36] rounded-xl p-6 border border-[#232a36]">
                        <div className="w-12 h-12 bg-[#181c24] rounded-xl flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-[#3b82f6]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">AI Optimization</h3>
                        <p className="text-sm text-blue-200">
                            Our AI analyzes your profile and optimizes it for each job application automatically.
                        </p>
                    </div>

                    <div className="bg-[#232a36] rounded-xl p-6 border border-[#232a36]">
                        <div className="w-12 h-12 bg-[#181c24] rounded-xl flex items-center justify-center mb-4">
                            <CheckCircle className="w-6 h-6 text-[#6366f1]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">ATS Friendly</h3>
                        <p className="text-sm text-blue-200">
                            All information is formatted to pass through Applicant Tracking Systems seamlessly.
                        </p>
                    </div>

                    <div className="bg-[#232a36] rounded-xl p-6 border border-[#232a36]">
                        <div className="w-12 h-12 bg-[#181c24] rounded-xl flex items-center justify-center mb-4">
                            <Award className="w-6 h-6 text-[#a21caf]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Stand Out</h3>
                        <p className="text-sm text-blue-200">
                            Highlight your achievements and skills in a way that catches recruiters' attention.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}