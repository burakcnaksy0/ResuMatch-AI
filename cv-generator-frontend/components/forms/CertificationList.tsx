'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificationSchema, CertificationFormData } from '@/lib/validations/schemas';
import { certificationApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Certification } from '@/types';
import { Award, Calendar, Link as LinkIcon, Trash2, Edit3, Plus, X } from 'lucide-react';

interface CertificationListProps {
    profileId: string;
    certifications?: Certification[];
    onUpdate?: () => void;
}

export default function CertificationList({ profileId, certifications: initialCertifications = [], onUpdate }: CertificationListProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profileId) {
            fetchCertifications();
        }
    }, [profileId]);

    const fetchCertifications = async () => {
        setLoading(true);
        try {
            const response = await certificationApi.getAllByProfile(profileId);
            setCertifications(response.data);
        } catch (error) {
            console.error('Failed to fetch certifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        fetchCertifications();
        onUpdate?.();
    };

    return (
        <div className="space-y-6">
            {!profileId && (
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-200 flex items-center gap-2">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding certifications.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-[#3b82f6]" />
                    Certifications
                </h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Certification
                </button>
            </div>

            <div className="space-y-4">
                {certifications.map((cert) => (
                    <div key={cert.id} className="bg-[#181c24] border border-[#232a36] rounded-xl overflow-hidden hover:border-[#3b82f6]/50 transition-all shadow-sm">
                        {editingId === cert.id ? (
                            <div className="p-6">
                                <CertificationForm
                                    profileId={profileId}
                                    initialData={cert}
                                    certificationId={cert.id}
                                    onSuccess={() => {
                                        setEditingId(null);
                                        handleUpdate();
                                    }}
                                    onCancel={() => setEditingId(null)}
                                />
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-white mb-1">{cert.name}</h3>
                                        <p className="text-blue-200 font-medium">{cert.issuer}</p>

                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                                {cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`}
                                            </span>
                                        </div>

                                        {cert.credentialId && <p className="text-sm text-gray-400 mt-2 font-mono bg-[#232a36] px-2 py-1 rounded inline-block border border-[#2a3241]">ID: {cert.credentialId}</p>}

                                        {cert.credentialUrl && (
                                            <div className="mt-3">
                                                <a
                                                    href={cert.credentialUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
                                                >
                                                    <LinkIcon className="w-3 h-3" /> View Credential
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button onClick={() => setEditingId(cert.id)} className="p-2 text-blue-400 hover:bg-[#232a36] rounded-lg transition-colors" title="Edit">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (confirm('Delete this certification?')) {
                                                    try {
                                                        await certificationApi.delete(cert.id);
                                                        toast.success('Certification deleted');
                                                        handleUpdate();
                                                    } catch (error) {
                                                        toast.error('Failed to delete');
                                                    }
                                                }
                                            }}
                                            className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className="bg-[#181c24] border border-[#3b82f6] rounded-xl p-6 shadow-lg shadow-blue-900/10 relative">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white text-lg">Add New Certification</h3>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="p-2 hover:bg-[#232a36] rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <CertificationForm
                        profileId={profileId}
                        onSuccess={() => {
                            setIsAdding(false);
                            handleUpdate();
                        }}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            )}

            {certifications.length === 0 && !isAdding && (
                <div className="text-center py-12 bg-[#181c24] rounded-xl border border-[#232a36] border-dashed">
                    <div className="w-16 h-16 bg-[#232a36] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-lg mb-2">No certifications yet</p>
                    <p className="text-gray-500 text-sm mb-6">Add your professional certifications</p>
                    <button
                        onClick={() => setIsAdding(true)}
                        disabled={!profileId}
                        className="px-6 py-2 bg-[#232a36] text-blue-400 hover:text-blue-300 hover:bg-[#2a3241] rounded-xl transition-all font-medium inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Certification
                    </button>
                </div>
            )}
        </div>
    );
}

interface CertificationFormProps {
    profileId: string;
    initialData?: Partial<Certification>;
    certificationId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function CertificationForm({ profileId, initialData, certificationId, onSuccess, onCancel }: CertificationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CertificationFormData>({
        resolver: zodResolver(certificationSchema),
        defaultValues: initialData || {
            profileId,
            name: '',
            issuer: '',
            issueDate: '',
            expiryDate: '',
            credentialId: '',
            credentialUrl: '',
        },
    });

    const onSubmit = async (data: CertificationFormData) => {
        setIsSubmitting(true);
        try {
            if (certificationId) {
                await certificationApi.update(certificationId, data);
            } else {
                await certificationApi.create(data);
            }
            toast.success(certificationId ? 'Certification updated!' : 'Certification added!');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full px-4 py-2 bg-[#232a36] border border-[#2a3241] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all";
    const labelClasses = "block text-sm font-medium text-blue-200 mb-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Certification Name *</label>
                    <input
                        {...register('name')}
                        type="text"
                        className={inputClasses}
                        placeholder="AWS Certified Solutions Architect"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Issuer *</label>
                    <input
                        {...register('issuer')}
                        type="text"
                        className={inputClasses}
                        placeholder="Amazon Web Services"
                    />
                    {errors.issuer && <p className="text-red-400 text-sm mt-1">{errors.issuer.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Issue Date *</label>
                    <input
                        {...register('issueDate')}
                        type="date"
                        className={inputClasses}
                    />
                    {errors.issueDate && <p className="text-red-400 text-sm mt-1">{errors.issueDate.message}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Expiry Date</label>
                    <input
                        {...register('expiryDate')}
                        type="date"
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Credential ID</label>
                    <input
                        {...register('credentialId')}
                        type="text"
                        className={inputClasses}
                        placeholder="ABC123XYZ"
                    />
                </div>

                <div>
                    <label className={labelClasses}>Credential URL</label>
                    <input
                        {...register('credentialUrl')}
                        type="url"
                        className={inputClasses}
                        placeholder="https://..."
                    />
                    {errors.credentialUrl && <p className="text-red-400 text-sm mt-1">{errors.credentialUrl.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#232a36]">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-blue-200 bg-[#232a36] rounded-xl hover:bg-[#2a3241] transition-colors"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : certificationId ? 'Update' : 'Add'}
                </button>
            </div>
        </form>
    );
}
