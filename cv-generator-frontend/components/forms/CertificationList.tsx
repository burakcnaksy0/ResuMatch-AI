'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificationSchema, CertificationFormData } from '@/lib/validations/schemas';
import { certificationApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Certification } from '@/types';

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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding certifications.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Certifications</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Add Certification
                </button>
            </div>

            <div className="space-y-4">
                {certifications.map((cert) => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                        {editingId === cert.id ? (
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
                        ) : (
                            <div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{cert.name}</h3>
                                        <p className="text-gray-800 font-medium">{cert.issuer}</p>
                                        <p className="text-sm text-gray-600">
                                            Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                            {cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`}
                                        </p>
                                        {cert.credentialId && <p className="text-sm text-gray-700 mt-1">ID: {cert.credentialId}</p>}
                                        {cert.credentialUrl && (
                                            <a
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                                            >
                                                View Credential →
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingId(cert.id)} className="text-blue-600 hover:text-blue-700 text-sm">
                                            Edit
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
                                            className="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-4">Add New Certification</h3>
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
                <p className="text-gray-500 text-center py-8">No certifications yet.</p>
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
                toast.success('Certification updated!');
            } else {
                await certificationApi.create(data);
                toast.success('Certification added!');
            }
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
                    <input
                        {...register('name')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="AWS Certified Solutions Architect"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issuer *</label>
                    <input
                        {...register('issuer')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Amazon Web Services"
                    />
                    {errors.issuer && <p className="text-red-500 text-sm mt-1">{errors.issuer.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                    <input
                        {...register('issueDate')}
                        type="date"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.issueDate && <p className="text-red-500 text-sm mt-1">{errors.issueDate.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                        {...register('expiryDate')}
                        type="date"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
                    <input
                        {...register('credentialId')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ABC123XYZ"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
                    <input
                        {...register('credentialUrl')}
                        type="url"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                    />
                    {errors.credentialUrl && <p className="text-red-500 text-sm mt-1">{errors.credentialUrl.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : certificationId ? 'Update' : 'Add'}
                </button>
            </div>
        </form>
    );
}
