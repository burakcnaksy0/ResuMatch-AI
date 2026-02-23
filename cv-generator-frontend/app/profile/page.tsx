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
    Sparkles,
    Shield,
    ChevronRight,
    LayoutDashboard,
    Lightbulb,
    Info
} from 'lucide-react';
import Link from 'next/link';

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
            if (err.response?.status !== 404) {
                console.error('Failed to fetch profile', err);
                toast.error('Failed to load profile');
            }
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleProfileSuccess = () => {
        fetchProfile();
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User, description: 'Basic details & contact info', tip: 'Recruiters often search by location. Make sure yours is accurate!' },
        { id: 'experience', label: 'Experience', icon: Briefcase, description: 'Work history & achievements', tip: 'Quantify your achievements (e.g., "Increased sales by 20%").' },
        { id: 'education', label: 'Education', icon: GraduationCap, description: 'Academic background', tip: 'List your most recent degree first.' },
        { id: 'skills', label: 'Skills', icon: Code, description: 'Technical & soft skills', tip: 'Mix technical skills (Java) with soft skills (Leadership).' },
        { id: 'projects', label: 'Projects', icon: FolderKanban, description: 'Portfolio highlights', tip: 'Include links to live demos or GitHub repos if possible.' },
        { id: 'certifications', label: 'Certifications', icon: Award, description: 'Professional certificates', tip: 'Certifications show your commitment to continuous learning.' },
        { id: 'languages', label: 'Languages', icon: Languages, description: ' proficiency levels help set realistic expectations.' },
        { id: 'security', label: 'Security', icon: Shield, description: 'Account settings', tip: 'Use a strong, unique password to keep your data safe.' },
    ];

    const currentTabInfo = tabs.find(t => t.id === activeTab);

    const completion = profile?.completeness?.total || 0;
    const suggestions = profile?.completeness?.suggestions || [];

    if (loadingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] text-gray-100 pb-20 selection:bg-blue-500/30">
            {/* Header / Breadcrumb */}
            <div className="bg-[#151925]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 supports-[backdrop-filter]:bg-[#151925]/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                            <span className="text-white font-medium bg-white/5 px-2 py-0.5 rounded text-xs">My Profile</span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                <div className={`w-2 h-2 rounded-full ${completion === 100 ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
                                <span className={`text-xs font-medium ${completion === 100 ? 'text-green-400' : 'text-blue-400'}`}>
                                    {completion === 100 ? 'All Set!' : `${completion}% Complete`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Sticky Sidebar */}
                    <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
                        {/* User Card */}
                        <div className="bg-[#151925] rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-xl ring-4 ring-[#151925]">
                                    {profile?.firstName?.[0] || 'U'}{profile?.lastName?.[0] || ''}
                                </div>
                            </div>

                            <h2 className="text-lg font-bold text-white mb-1 relative z-10">
                                {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : 'User Profile'}
                            </h2>
                            <p className="text-sm text-gray-400 mb-4">{profile?.email}</p>

                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider border mb-6 ${isPro
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                {isPro ? 'PRO PLAN' : 'FREE PLAN'}
                            </div>

                            {/* Profile Strength Bar */}
                            <div className="w-full text-left bg-black/20 rounded-xl p-3 border border-white/5">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-gray-400 font-medium">Profile Strength</span>
                                    <span className={completion === 100 ? 'text-green-400' : 'text-blue-400 font-bold'}>{completion}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${completion === 100
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                            }`}
                                        style={{ width: `${completion}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="bg-[#151925] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all duration-300 relative overflow-hidden group
                                            ${isActive
                                                ? 'text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent border-l-4 border-blue-500" />
                                        )}
                                        <Icon className={`w-4 h-4 relative z-10 transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                                        <span className="relative z-10">{tab.label}</span>
                                        {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-500 relative z-10" />}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Dynamic Pro Tip */}
                        {currentTabInfo?.tip && (
                            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-5 border border-indigo-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Lightbulb className="w-12 h-12 text-white" />
                                </div>
                                <div className="flex items-start gap-3 relative z-10">
                                    <div className="bg-indigo-500/20 p-2 rounded-lg">
                                        <Lightbulb className="w-4 h-4 text-indigo-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wide mb-1">Expert Tip</h4>
                                        <p className="text-xs text-indigo-100/80 leading-relaxed">
                                            {currentTabInfo.tip}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-6">

                        {/* Suggestions Banner - Only show if incomplete */}
                        {completion < 100 && suggestions.length > 0 && (
                            <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] border border-blue-500/30 rounded-2xl p-1 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="bg-[#151925]/50 backdrop-blur-sm rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 relative z-10">
                                    <div className="p-3 bg-blue-500/10 rounded-xl shrink-0 border border-blue-500/20">
                                        <Sparkles className="w-5 h-5 text-blue-400 animate-pulse-slow" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                            Profile Optimization
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500 text-white">Recommended</span>
                                        </h3>
                                        <p className="text-xs text-gray-400">Complete these sections to unlock better job matching scores:</p>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                        {suggestions.slice(0, 2).map((s: string, i: number) => (
                                            <span key={i} className="whitespace-nowrap px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 transition-colors rounded-lg text-xs font-medium text-blue-300 border border-blue-500/20 cursor-default flex items-center gap-1.5">
                                                <Info className="w-3 h-3" /> {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content Panel */}
                        <div className="bg-[#151925] rounded-2xl border border-white/5 min-h-[600px] shadow-2xl relative overflow-hidden">
                            {/* Top Glow */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50" />

                            <div className="border-b border-white/5 p-6 md:p-8 bg-[#1a1f2e]/30">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-inner border border-white/5">
                                        {(() => {
                                            const t = tabs.find(x => x.id === activeTab);
                                            const Icon = t?.icon || User;
                                            return <Icon className="w-6 h-6 text-white" />;
                                        })()}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">
                                            {tabs.find(t => t.id === activeTab)?.label}
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            {tabs.find(t => t.id === activeTab)?.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="animate-fade-in-up">
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

                    </div>
                </div>
            </div>
        </div>
    );
}