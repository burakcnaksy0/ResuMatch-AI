'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generatedCVApi } from '@/lib/api/client';
import { GeneratedCV } from '@/types';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    FileText,
    Eye,
    Trash2,
    Download,
    Plus,
    Building2,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Sparkles,
    Filter,
    Search,
    TrendingUp,
    Archive,
    ExternalLink
} from 'lucide-react';

export default function GeneratedCVsPage() {
    const { user, isAuthenticated } = useAuth();
    const [cvs, setCvs] = useState<GeneratedCV[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchCVs();
        }
    }, [isAuthenticated, user]);

    const fetchCVs = async () => {
        if (!user?.id) return;
        try {
            const response = await generatedCVApi.getAll(user.id);
            setCvs(response.data);
        } catch (error) {
            console.error('Failed to fetch CVs', error);
            toast.error('Failed to load CVs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this CV?')) return;
        if (!user?.id) return;

        try {
            await generatedCVApi.delete(id, user.id);
            setCvs(cvs.filter(cv => cv.id !== id));
            toast.success('CV deleted successfully');
        } catch (error) {
            toast.error('Failed to delete CV');
        }
    };

    // Filter and search logic
    const filteredCVs = cvs.filter(cv => {
        const matchesStatus = filterStatus === 'all' || cv.generationStatus === filterStatus;
        const matchesSearch = searchTerm === '' ||
            cv.jobPosting?.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cv.jobPosting?.company?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Stats calculation
    const stats = {
        total: cvs.length,
        completed: cvs.filter(cv => cv.generationStatus === 'completed').length,
        pending: cvs.filter(cv => cv.generationStatus === 'pending').length,
        failed: cvs.filter(cv => cv.generationStatus === 'failed').length,
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'completed':
                return {
                    icon: CheckCircle,
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    label: 'Completed'
                };
            case 'failed':
                return {
                    icon: XCircle,
                    color: 'text-red-600',
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    label: 'Failed'
                };
            case 'pending':
                return {
                    icon: Clock,
                    color: 'text-yellow-600',
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    label: 'Pending'
                };
            default:
                return {
                    icon: Clock,
                    color: 'text-gray-600',
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    label: status
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your CVs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    Generated CVs
                                </h1>
                            </div>
                            <p className="text-lg text-gray-600">
                                Manage and download your AI-generated CVs
                            </p>
                        </div>
                        <Link
                            href="/jobs"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold flex items-center gap-2 shadow-lg shadow-blue-200"
                        >
                            <Plus className="w-5 h-5" />
                            Generate New CV
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                                    <div className="text-sm text-gray-600">Total CVs</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-50 rounded-lg">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                                    <div className="text-sm text-gray-600">Pending</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.failed}</div>
                                    <div className="text-sm text-gray-600">Failed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by job title or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${filterStatus === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterStatus('completed')}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${filterStatus === 'completed'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Completed
                            </button>
                            <button
                                onClick={() => setFilterStatus('pending')}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${filterStatus === 'pending'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setFilterStatus('failed')}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${filterStatus === 'failed'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Failed
                            </button>
                        </div>
                    </div>
                </div>

                {/* CVs List */}
                {filteredCVs.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {searchTerm || filterStatus !== 'all' ? 'No CVs found' : 'No CVs generated yet'}
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your filters or search term'
                                : 'Start by analyzing a job posting and generating your first tailored CV'
                            }
                        </p>
                        <Link
                            href="/jobs"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-200"
                        >
                            <Plus className="w-5 h-5" />
                            Generate Your First CV
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredCVs.map((cv) => {
                            const statusConfig = getStatusConfig(cv.generationStatus);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <div
                                    key={cv.id}
                                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        {/* Left Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                                                    <FileText className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {cv.jobPosting?.jobTitle || 'Untitled Position'}
                                                    </h3>
                                                    {cv.jobPosting?.company && (
                                                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                                                            <Building2 className="w-4 h-4" />
                                                            <span className="font-medium">{cv.jobPosting.company}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-wrap gap-3 text-sm">
                                                        {/* Status Badge */}
                                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 ${statusConfig.bg} ${statusConfig.border} border rounded-lg`}>
                                                            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                                                            <span className={`font-medium ${statusConfig.color}`}>
                                                                {statusConfig.label}
                                                            </span>
                                                        </div>

                                                        {/* Date */}
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{new Date(cv.createdAt).toLocaleDateString()}</span>
                                                        </div>

                                                        {/* AI Model */}
                                                        {cv.aiModelUsed && (
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-purple-600">
                                                                <Sparkles className="w-4 h-4" />
                                                                <span className="font-medium">{cv.aiModelUsed}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Actions */}
                                        <div className="flex md:flex-col gap-2">
                                            {cv.generationStatus === 'completed' && (
                                                <>
                                                    <Link
                                                        href={`/cvs/${cv.id}`}
                                                        className="group flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm"
                                                        title="View CV"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span className="hidden sm:inline">View</span>
                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Link>
                                                    <button
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium shadow-sm"
                                                        title="Download PDF"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Download</span>
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(cv.id)}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium"
                                                title="Delete CV"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Help Section */}
                {filteredCVs.length > 0 && (
                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Keep Track of Applications</h3>
                                    <p className="text-blue-100 text-sm">
                                        Download your CVs and keep track of which version you sent to which company for better follow-ups.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Archive className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Archive Old CVs</h3>
                                    <p className="text-purple-100 text-sm">
                                        Delete CVs for positions you're no longer interested in to keep your dashboard organized.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
