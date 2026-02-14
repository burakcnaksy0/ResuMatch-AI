'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, EducationFormData } from '@/lib/validations/schemas';
import { educationApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Education } from '@/types';
import { GraduationCap, Calendar, Trash2, Edit3, Plus, X } from 'lucide-react';

interface EducationListProps {
    profileId: string;
    educations?: Education[];
    onUpdate?: () => void;
}

export default function EducationList({ profileId, educations: initialEducations = [], onUpdate }: EducationListProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [educations, setEducations] = useState<Education[]>(initialEducations);
    const [loading, setLoading] = useState(false);

    // Fetch educations on mount
    useEffect(() => {
        if (profileId) {
            fetchEducations();
        }
    }, [profileId]);

    const fetchEducations = async () => {
        setLoading(true);
        try {
            const response = await educationApi.getAllByProfile(profileId);
            setEducations(response.data);
        } catch (error) {
            console.error('Failed to fetch educations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        fetchEducations();
        onUpdate?.();
    };

    return (
        <div className="space-y-6">
            {!profileId && (
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-200 flex items-center gap-2">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding education.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-[#3b82f6]" />
                    Education
                </h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Education
                </button>
            </div>

            {/* Existing Education Entries */}
            <div className="space-y-4">
                {educations.map((edu) => (
                    <div key={edu.id} className="bg-[#181c24] border border-[#232a36] rounded-xl overflow-hidden hover:border-[#3b82f6]/50 transition-all shadow-sm">
                        {editingId === edu.id ? (
                            <div className="p-6">
                                <EducationForm
                                    profileId={profileId}
                                    initialData={edu}
                                    educationId={edu.id}
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
                                        <h3 className="font-bold text-lg text-white mb-1">{edu.degree}</h3>
                                        <p className="text-blue-200 font-medium mb-1">{edu.institution}</p>
                                        {edu.fieldOfStudy && <p className="text-gray-400 text-sm mb-2">{edu.fieldOfStudy}</p>}
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(edu.startDate).toLocaleDateString()} -{' '}
                                                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                                                </span>
                                            </div>
                                            {edu.gpa && <span className="bg-[#232a36] px-2 py-0.5 rounded text-gray-300 text-xs font-medium border border-[#2a3241]">GPA: {edu.gpa}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingId(edu.id)}
                                            className="p-2 text-blue-400 hover:bg-[#232a36] rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (confirm('Are you sure you want to delete this education entry?')) {
                                                    try {
                                                        await educationApi.delete(edu.id);
                                                        toast.success('Education deleted');
                                                        handleUpdate();
                                                    } catch (error) {
                                                        toast.error('Failed to delete education');
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
                                {edu.description && (
                                    <div className="mt-4 pt-4 border-t border-[#232a36]">
                                        <p className="text-gray-400 text-sm leading-relaxed">{edu.description}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add New Education Form */}
            {isAdding && (
                <div className="bg-[#181c24] border border-[#3b82f6] rounded-xl p-6 shadow-lg shadow-blue-900/10 relative">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white text-lg">Add New Education</h3>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="p-2 hover:bg-[#232a36] rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <EducationForm
                        profileId={profileId}
                        onSuccess={() => {
                            setIsAdding(false);
                            handleUpdate();
                        }}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            )}

            {educations.length === 0 && !isAdding && (
                <div className="text-center py-12 bg-[#181c24] rounded-xl border border-[#232a36] border-dashed">
                    <div className="w-16 h-16 bg-[#232a36] rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-lg mb-2">No education entries yet</p>
                    <p className="text-gray-500 text-sm mb-6">Add details about your academic background</p>
                    <button
                        onClick={() => setIsAdding(true)}
                        disabled={!profileId}
                        className="px-6 py-2 bg-[#232a36] text-blue-400 hover:text-blue-300 hover:bg-[#2a3241] rounded-xl transition-all font-medium inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Education
                    </button>
                </div>
            )}
        </div>
    );
}

interface EducationFormProps {
    profileId: string;
    initialData?: Partial<Education>;
    educationId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function EducationForm({ profileId, initialData, educationId, onSuccess, onCancel }: EducationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: initialData || {
            profileId,
            institution: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            gpa: undefined,
            description: '',
        },
    });

    const onSubmit = async (data: EducationFormData) => {
        setIsSubmitting(true);
        try {
            if (educationId) {
                await educationApi.update(educationId, data);
            } else {
                await educationApi.create(data);
            }
            toast.success(educationId ? 'Education updated!' : 'Education added!');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save education');
            console.error('Education save error:', error);
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
                    <label className={labelClasses}>
                        Institution *
                    </label>
                    <input
                        {...register('institution')}
                        type="text"
                        className={inputClasses}
                        placeholder="University of California"
                    />
                    {errors.institution && (
                        <p className="text-red-400 text-sm mt-1">{errors.institution.message}</p>
                    )}
                </div>

                <div>
                    <label className={labelClasses}>
                        Degree *
                    </label>
                    <input
                        {...register('degree')}
                        type="text"
                        className={inputClasses}
                        placeholder="Bachelor of Science"
                    />
                    {errors.degree && (
                        <p className="text-red-400 text-sm mt-1">{errors.degree.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className={labelClasses}>
                    Field of Study
                </label>
                <input
                    {...register('fieldOfStudy')}
                    type="text"
                    className={inputClasses}
                    placeholder="Computer Science"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className={labelClasses}>
                        Start Date *
                    </label>
                    <input
                        {...register('startDate')}
                        type="date"
                        className={inputClasses}
                    />
                    {errors.startDate && (
                        <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>
                    )}
                </div>

                <div>
                    <label className={labelClasses}>
                        End Date
                    </label>
                    <input
                        {...register('endDate')}
                        type="date"
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label className={labelClasses}>
                        GPA
                    </label>
                    <input
                        {...register('gpa', { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        className={inputClasses}
                        placeholder="3.8"
                    />
                    {errors.gpa && (
                        <p className="text-red-400 text-sm mt-1">{errors.gpa.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className={labelClasses}>
                    Description
                </label>
                <textarea
                    {...register('description')}
                    rows={3}
                    className={inputClasses}
                    placeholder="Relevant coursework, achievements, honors..."
                />
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
                    {isSubmitting ? 'Saving...' : educationId ? 'Update' : 'Add'}
                </button>
            </div>
        </form>
    );
}
