'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { jobPostingApi, generatedCVApi, profileApi } from '@/lib/api/client';
import { JobPosting } from '@/types';
import toast from 'react-hot-toast';
import JobPostingForm from '@/components/forms/JobPostingForm';
import Link from 'next/link';
import GenerateCvModal from '@/components/modals/GenerateCvModal';
import {
    Briefcase,
    Plus,
    Search,
    Sparkles,
    FileText,
    Trash2,
    Edit3,
    Building2,
    Calendar,
    MapPin,
    TrendingUp,
    Award,
    Target,
    X,
    ChevronRight,
    Zap,
    CheckCircle,
    AlertCircle,
    Crown
} from 'lucide-react';

export default function JobsPage() {
    const { user, isAuthenticated } = useAuth();
    const { subscription, canGenerateJobBasedCV, canGenerateProfileBasedCV, loading: subscriptionLoading } = useSubscription();
    const router = useRouter();
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const [profile, setProfile] = useState<any>(null);
    const [profileId, setProfileId] = useState<string>('');
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedJobForGeneration, setSelectedJobForGeneration] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchJobs();
            fetchProfile();
        }
    }, [isAuthenticated, user]);

    const fetchProfile = async () => {
        try {
            const profileRes = await profileApi.getMe();
            setProfile(profileRes.data);
            setProfileId(profileRes.data.id);
        } catch (e) {
            console.error('Failed to fetch profile info', e);
        }
    };

    const fetchJobs = async () => {
        if (!user?.id) return;
        try {
            const response = await jobPostingApi.getAll(user.id);
            setJobs(response.data);
        } catch (error) {
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this job posting?')) return;
        if (!user?.id) return;

        try {
            await jobPostingApi.delete(id, user.id);
            toast.success('Job deleted');
            fetchJobs();
        } catch (error) {
            toast.error('Failed to delete job');
        }
    };

    const handleAnalyze = async (id: string) => {
        if (!user?.id) return;
        setAnalyzingId(id);
        try {
            const response = await jobPostingApi.analyze(id, user.id);
            setAnalysisResult({ jobId: id, ...response.data });
            toast.success('Analysis complete!');
        } catch (error) {
            toast.error('Failed to analyze job');
        } finally {
            setAnalyzingId(null);
        }
    };

    const openGenerateModal = (jobId?: string) => {
        if (subscriptionLoading) {
            toast('Checking subscription status...', { icon: '⏳' });
            return;
        }

        if (!user?.id || !profileId) {
            toast.error('Please complete your profile first');
            router.push('/profile');
            return;
        }

        // Check subscription limits
        if (jobId) {
            // Job-based CV
            if (!canGenerateJobBasedCV()) {
                toast.error(
                    <div className="flex flex-col gap-2">
                        <p className="font-semibold">İş bazlı CV limitine ulaştınız!</p>
                        <p className="text-sm">Pro'ya yükselterek sınırsız CV oluşturun.</p>
                    </div>,
                    {
                        duration: 5000,
                        icon: '⚠️',
                    }
                );
                router.push('/pricing');
                return;
            }
        } else {
            // Profile-based CV
            if (!canGenerateProfileBasedCV()) {
                toast.error(
                    <div className="flex flex-col gap-2">
                        <p className="font-semibold">Profil bazlı CV limitine ulaştınız!</p>
                        <p className="text-sm">Pro'ya yükselterek sınırsız CV oluşturun.</p>
                    </div>,
                    {
                        duration: 5000,
                        icon: '⚠️',
                    }
                );
                router.push('/pricing');
                return;
            }
        }

        if (!jobId && profile) {
            const hasWorkExp = profile.workExperience && profile.workExperience.length > 0;
            const hasSkills = profile.skills && profile.skills.length > 0;
            const hasEducation = profile.education && profile.education.length > 0;

            if (!hasWorkExp || !hasSkills || !hasEducation) {
                toast('Suggestion: Fill out Work Experience, Skills and Education for better results.', {
                    icon: '💡',
                    duration: 5000
                });
            }
        }

        setSelectedJobForGeneration(jobId || null);
        setShowGenerateModal(true);
    };

    const handleConfirmGenerate = async (options: any) => {
        if (!user?.id) return;

        setGeneratingId(selectedJobForGeneration || 'general');
        try {
            const response = await generatedCVApi.generate({
                profileId,
                jobPostingId: selectedJobForGeneration || undefined,
                userId: user.id,
                includeProfilePicture: options.includeProfilePicture,
                cvSpecificPhotoUrl: options.cvSpecificPhotoUrl,
                tone: options.tone,
                templateName: options.templateName,
            });
            toast.success('CV generated successfully!');
            // Wait a bit before redirecting so toast is visible
            setTimeout(() => {
                router.push('/cvs'); // Redirect to CVs list instead of dashboard for better UX
            }, 1000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to generate CV');
        } finally {
            setGeneratingId(null);
            setShowGenerateModal(false);
            setSelectedJobForGeneration(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#10131a]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mb-4"></div>
                    <p className="text-blue-200 font-medium">Loading job postings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#10131a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-gradient-to-br from-[#3b82f6] to-[#6366f1] rounded-xl">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">
                                    Job Postings
                                </h1>
                            </div>
                            <p className="text-lg text-blue-200">
                                Manage job opportunities and generate tailored CVs with AI
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/profile"
                                className="px-5 py-2.5 text-blue-200 bg-[#232a36] border-2 border-[#232a36] rounded-xl hover:bg-[#181c24] hover:border-[#3b82f6] transition-all font-medium flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4" />
                                My Profile
                            </Link>
                            <button
                                onClick={() => openGenerateModal()}
                                disabled={subscriptionLoading}
                                className="px-5 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#a21caf] text-white rounded-xl hover:from-[#4f46e5] hover:to-[#86198f] transition-all font-semibold flex items-center gap-2 shadow-lg shadow-purple-900 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {subscriptionLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Sparkles className="w-5 h-5" />
                                )}
                                General CV
                            </button>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="px-5 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white rounded-xl hover:from-[#2563eb] hover:to-[#4f46e5] transition-all font-semibold flex items-center gap-2 shadow-lg shadow-blue-900"
                            >
                                <Plus className="w-5 h-5" />
                                Add Job
                            </button>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                        <div className="bg-[#232a36] rounded-xl p-4 border border-[#232a36]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#181c24] rounded-lg">
                                    <Briefcase className="w-5 h-5 text-[#3b82f6]" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{jobs.length}</div>
                                    <div className="text-sm text-blue-200">Total Jobs</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#232a36] rounded-xl p-4 border border-[#232a36]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#181c24] rounded-lg">
                                    <Sparkles className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        {jobs.filter(j => j.keywords && j.keywords.length > 0).length}
                                    </div>
                                    <div className="text-sm text-blue-200">Analyzed</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#232a36] rounded-xl p-4 border border-[#232a36]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#181c24] rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">Ready</div>
                                    <div className="text-sm text-blue-200">To Generate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Job Form */}
                {isAdding && (
                    <div className="bg-[#232a36] rounded-2xl shadow-lg border border-[#232a36] p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#181c24] rounded-lg">
                                    <Plus className="w-6 h-6 text-[#3b82f6]" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Add New Job Posting</h2>
                            </div>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="p-2 hover:bg-[#181c24] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-blue-200" />
                            </button>
                        </div>
                        <JobPostingForm
                            userId={user?.id || ''}
                            onSuccess={() => {
                                setIsAdding(false);
                                fetchJobs();
                            }}
                            onCancel={() => setIsAdding(false)}
                        />
                    </div>
                )}

                {/* Analysis Results */}
                {analysisResult && (
                    <div className="bg-[#232a36] border-2 border-[#3b82f6] rounded-2xl p-6 mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#181c24] rounded-xl">
                                    <Search className="w-6 h-6 text-[#3b82f6]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        AI Analysis Results
                                    </h3>
                                    <p className="text-sm text-blue-200">
                                        Key insights extracted from the job posting
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAnalysisResult(null)}
                                className="p-2 hover:bg-[#181c24] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-blue-200" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Column 1: Match Score & Experience */}
                            <div className="space-y-6">
                                {analysisResult.matchAnalysis && (
                                    <div className="bg-[#181c24] rounded-xl p-5 border border-[#3b82f6] shadow-sm">
                                        <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                                            <Target className="w-5 h-5 text-[#3b82f6]" />
                                            Match Score
                                        </h4>
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-8 border-[#3b82f6]/30">
                                                <span className="text-2xl font-bold text-[#3b82f6]">
                                                    {analysisResult.matchAnalysis.matchPercentage}%
                                                </span>
                                            </div>
                                            <div className="mt-4 w-full space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-blue-200 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Matches</span>
                                                    <span className="font-bold text-green-400">{analysisResult.matchAnalysis.matchingSkills?.length || 0}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-blue-200 flex items-center gap-1"><AlertCircle className="w-3 h-3 text-red-500" /> Missing</span>
                                                    <span className="font-bold text-red-400">{analysisResult.matchAnalysis.missingSkills?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-[#181c24] rounded-xl p-5 border border-purple-500/30 shadow-sm">
                                    <h4 className="flex items-center gap-2 font-bold text-white mb-2">
                                        <Award className="w-5 h-5 text-purple-400" />
                                        Experience Level
                                    </h4>
                                    <p className="text-lg font-bold text-purple-300 capitalize">
                                        {analysisResult.experienceLevel || 'Not specified'}
                                    </p>
                                </div>
                            </div>

                            {/* Column 2: Skills & Details */}
                            <div className="space-y-6 lg:col-span-2">
                                <div className="bg-[#181c24] rounded-xl p-5 border border-[#232a36] shadow-sm">
                                    <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Required Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.technicalSkills?.map((skill: string, idx: number) => (
                                            <span key={`tech-${idx}`} className="px-3 py-1 bg-blue-900/30 text-blue-300 text-xs font-medium rounded-lg border border-blue-500/30">
                                                {skill}
                                            </span>
                                        ))}
                                        {analysisResult.softSkills?.map((skill: string, idx: number) => (
                                            <span key={`soft-${idx}`} className="px-3 py-1 bg-green-900/30 text-green-300 text-xs font-medium rounded-lg border border-green-500/30">
                                                {skill}
                                            </span>
                                        ))}
                                        {(!analysisResult.technicalSkills && !analysisResult.softSkills && analysisResult.requiredSkills) &&
                                            analysisResult.requiredSkills.map((s: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-[#232a36] text-blue-200 text-xs font-medium rounded-lg border border-[#232a36]">{s}</span>
                                            ))
                                        }
                                    </div>
                                </div>

                                {analysisResult.roleExpectations && analysisResult.roleExpectations.length > 0 && (
                                    <div className="bg-[#181c24] rounded-xl p-5 border border-amber-500/30 shadow-sm">
                                        <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                                            <Sparkles className="w-5 h-5 text-amber-400" />
                                            Role Expectations
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysisResult.roleExpectations.map((exp: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-blue-200">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                                                    {exp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {analysisResult.matchAnalysis?.missingSkills?.length > 0 && (
                                    <div className="bg-red-900/20 rounded-xl p-5 border border-red-500/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-5 h-5 text-red-400" />
                                            <h4 className="font-bold text-red-300">Missing Skills Detected</h4>
                                        </div>
                                        <p className="text-sm text-red-200 mb-3 opacity-90">
                                            Your profile is missing these key skills found in the job description:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.matchAnalysis.missingSkills.map((skill: string, idx: number) => (
                                                <span key={idx} className="px-2 py-1 bg-[#181c24] text-red-300 text-xs border border-red-500/30 rounded shadow-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Jobs List */}
                <div className="space-y-6">
                    {jobs.length === 0 && !isAdding ? (
                        <div className="bg-[#232a36] rounded-2xl shadow-lg border border-[#232a36] p-12 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#6366f1] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Briefcase className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                No job postings yet
                            </h3>
                            <p className="text-blue-200 mb-8 max-w-md mx-auto">
                                Add your first job posting to start generating perfectly tailored CVs with AI
                            </p>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="px-8 py-4 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white rounded-xl hover:from-[#2563eb] hover:to-[#4f46e5] transition-all font-semibold inline-flex items-center gap-2 shadow-lg shadow-blue-900"
                            >
                                <Plus className="w-5 h-5" />
                                Add Your First Job
                            </button>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className="bg-[#232a36] rounded-2xl shadow-lg border border-[#232a36] overflow-hidden hover:border-[#3b82f6] hover:shadow-xl transition-all duration-200">
                                {/* Edit Mode */}
                                {editingId === job.id ? (
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[#181c24] rounded-lg">
                                                    <Edit3 className="w-6 h-6 text-[#3b82f6]" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white">Edit Job Posting</h3>
                                            </div>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-2 hover:bg-[#181c24] rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5 text-blue-200" />
                                            </button>
                                        </div>
                                        <JobPostingForm
                                            userId={user?.id || ''}
                                            initialData={job}
                                            jobPostingId={job.id}
                                            onSuccess={() => {
                                                setEditingId(null);
                                                fetchJobs();
                                            }}
                                            onCancel={() => setEditingId(null)}
                                        />
                                    </div>
                                ) : (
                                    /* Normal Display Mode */
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="p-3 bg-[#181c24] rounded-xl">
                                                        <Briefcase className="w-6 h-6 text-[#3b82f6]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl font-bold text-white mb-2">
                                                            {job.jobTitle}
                                                        </h3>
                                                        {job.company && (
                                                            <div className="flex items-center gap-2 text-blue-200 mb-2">
                                                                <Building2 className="w-4 h-4" />
                                                                <span className="font-medium">{job.company}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex flex-wrap gap-3 text-sm text-blue-200">
                                                            {job.location && (
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    <span>{job.location}</span>
                                                                </div>
                                                            )}
                                                            {job.createdAt && (
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => openGenerateModal(job.id)}
                                                    disabled={generatingId === job.id}
                                                    className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-green-900"
                                                >
                                                    {generatingId === job.id ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="w-4 h-4" />
                                                            Generate CV
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleAnalyze(job.id)}
                                                    disabled={analyzingId === job.id}
                                                    className="px-4 py-2.5 text-[#3b82f6] bg-[#181c24] hover:bg-[#232a36] rounded-xl transition-all font-medium disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {analyzingId === job.id ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3b82f6]"></div>
                                                            Analyzing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Search className="w-4 h-4" />
                                                            Analyze
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(job.id)}
                                                    className="px-4 py-2.5 text-blue-200 bg-[#181c24] hover:bg-[#232a36] rounded-xl transition-all font-medium flex items-center gap-2"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    className="px-4 py-2.5 text-red-300 bg-red-900/30 hover:bg-red-900/50 rounded-xl transition-all font-medium flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Job Description */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-blue-200 mb-3">Job Description</h4>
                                            <p className="text-blue-100 leading-relaxed line-clamp-4">
                                                {job.jobDescription}
                                            </p>
                                        </div>

                                        {/* Keywords/Tags */}
                                        {job.keywords && job.keywords.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-blue-200 mb-3">Keywords</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.keywords.slice(0, 10).map((keyword, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 bg-[#181c24] text-blue-200 text-sm font-medium rounded-lg"
                                                        >
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                    {job.keywords.length > 10 && (
                                                        <span className="px-3 py-1 bg-[#181c24] text-blue-300 text-sm font-medium rounded-lg">
                                                            +{job.keywords.length - 10} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Help Section */}
                {jobs.length > 0 && (
                    <div className="mt-8 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] rounded-2xl p-8 text-white">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">Pro Tip: Analyze Before Generating</h3>
                                <p className="text-blue-100 leading-relaxed">
                                    Use the "Analyze" feature to extract key skills and requirements from the job posting.
                                    This helps our AI create even more targeted CVs that match exactly what recruiters are looking for.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Generate CV Modal */}
            <GenerateCvModal
                isOpen={showGenerateModal}
                onClose={() => {
                    setShowGenerateModal(false);
                    setSelectedJobForGeneration(null);
                }}
                onGenerate={handleConfirmGenerate}
                profilePictureUrl={profile?.profilePictureUrl}
                isGenerating={!!generatingId}
            />
        </div>
    );
}