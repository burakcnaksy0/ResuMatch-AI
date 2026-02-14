'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { languageSchema, LanguageFormData } from '@/lib/validations/schemas';
import { languageApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Language } from '@/types';
import { Globe, Plus, X, Trash2 } from 'lucide-react';

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
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-200 flex items-center gap-2">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding languages.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-6 h-6 text-[#3b82f6]" />
                    Languages
                </h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Language
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((lang) => (
                    <div key={lang.id} className="bg-[#181c24] border border-[#232a36] rounded-xl p-4 hover:border-[#3b82f6]/50 transition-all shadow-sm group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-white text-lg">{lang.name}</h3>
                                {lang.proficiency && (
                                    <p className="text-sm text-blue-200 mt-1 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
                                        {lang.proficiency}
                                    </p>
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
                                className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#232a36] rounded-lg"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className="bg-[#181c24] border border-[#3b82f6] rounded-xl p-6 shadow-lg shadow-blue-900/10 relative">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white text-lg">Add New Language</h3>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="p-2 hover:bg-[#232a36] rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
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
                <div className="text-center py-12 bg-[#181c24] rounded-xl border border-[#232a36] border-dashed">
                    <div className="w-16 h-16 bg-[#232a36] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-lg mb-2">No languages yet</p>
                    <p className="text-gray-500 text-sm mb-6">Add languages you speak</p>
                    <button
                        onClick={() => setIsAdding(true)}
                        disabled={!profileId}
                        className="px-6 py-2 bg-[#232a36] text-blue-400 hover:text-blue-300 hover:bg-[#2a3241] rounded-xl transition-all font-medium inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Language
                    </button>
                </div>
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

    const inputClasses = "w-full px-4 py-2 bg-[#232a36] border border-[#2a3241] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all";
    const labelClasses = "block text-sm font-medium text-blue-200 mb-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Language *</label>
                    <input
                        {...register('name')}
                        type="text"
                        className={inputClasses}
                        placeholder="English"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Proficiency</label>
                    <select
                        {...register('proficiency')}
                        className={inputClasses}
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
                    {isSubmitting ? 'Adding...' : 'Add Language'}
                </button>
            </div>
        </form>
    );
}
