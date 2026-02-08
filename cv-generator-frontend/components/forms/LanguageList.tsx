'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { languageSchema, LanguageFormData } from '@/lib/validations/schemas';
import { languageApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Language } from '@/types';

interface LanguageListProps {
    profileId: string;
    languages?: Language[];
    onUpdate?: () => void;
}

export default function LanguageList({ profileId, languages: initialLanguages = [], onUpdate }: LanguageListProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [languages, setLanguages] = useState<Language[]>(initialLanguages);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profileId) {
            fetchLanguages();
        }
    }, [profileId]);

    const fetchLanguages = async () => {
        setLoading(true);
        try {
            const response = await languageApi.getAll(profileId);
            setLanguages(response.data);
        } catch (error) {
            console.error('Failed to fetch languages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        fetchLanguages();
        onUpdate?.();
    };

    return (
        <div className="space-y-6">
            {!profileId && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding languages.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Languages</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Add Language
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((lang) => (
                    <div key={lang.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{lang.name}</h3>
                                {lang.proficiency && (
                                    <p className="text-sm text-gray-700">{lang.proficiency}</p>
                                )}
                            </div>
                            <button
                                onClick={async () => {
                                    if (confirm(`Delete language "${lang.name}"?`)) {
                                        try {
                                            await languageApi.delete(lang.id);
                                            toast.success('Language deleted');
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
                ))}
            </div>

            {isAdding && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-4">Add New Language</h3>
                    <LanguageForm
                        profileId={profileId}
                        onSuccess={() => {
                            setIsAdding(false);
                            handleUpdate();
                        }}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            )}

            {languages.length === 0 && !isAdding && (
                <p className="text-gray-500 text-center py-8">No languages yet.</p>
            )}
        </div>
    );
}

interface LanguageFormProps {
    profileId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function LanguageForm({ profileId, onSuccess, onCancel }: LanguageFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LanguageFormData>({
        resolver: zodResolver(languageSchema),
        defaultValues: {
            profileId,
            name: '',
            proficiency: '',
        },
    });

    const onSubmit = async (data: LanguageFormData) => {
        setIsSubmitting(true);
        try {
            await languageApi.create(data);
            toast.success('Language added!');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add language');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
                    <input
                        {...register('name')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="English"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                    <select
                        {...register('proficiency')}
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select...</option>
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Professional">Professional</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3">
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
                    {isSubmitting ? 'Adding...' : 'Add Language'}
                </button>
            </div>
        </form>
    );
}
