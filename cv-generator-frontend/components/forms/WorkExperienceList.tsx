'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workExperienceSchema, WorkExperienceFormData } from '@/lib/validations/schemas';
import { workExperienceApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { WorkExperience } from '@/types';
import { Briefcase, Calendar, MapPin, Trash2, Edit3, Plus, X } from 'lucide-react';

interface WorkExperienceListProps {
    profileId: string;
    experiences?: WorkExperience[];
    onUpdate?: () => void;
}

export default function WorkExperienceList({ profileId, experiences: initialExperiences = [], onUpdate }: WorkExperienceListProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [experiences, setExperiences] = useState<WorkExperience[]>(initialExperiences);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profileId) {
            fetchExperiences();
        }
    }, [profileId]);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const response = await workExperienceApi.getAllByProfile(profileId);
            setExperiences(response.data);
        } catch (error) {
            console.error('Failed to fetch work experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        fetchExperiences();
        onUpdate?.();
    };

    return (
        <div className="space-y-6">
            {!profileId && (
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-200 flex items-center gap-2">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding work experience.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-[#3b82f6]" />
                    Work Experience
                </h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Experience
                </button>
            </div>

            <div className="space-y-4">
                {experiences.map((exp) => (
                    <div key={exp.id} className="bg-[#181c24] border border-[#232a36] rounded-xl overflow-hidden hover:border-[#3b82f6]/50 transition-all shadow-sm">
                        {editingId === exp.id ? (
                            <div className="p-6">
                                <WorkExperienceForm
                                    profileId={profileId}
                                    initialData={exp}
                                    experienceId={exp.id}
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
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-white mb-1">{exp.position}</h3>
                                        <p className="text-blue-200 font-medium mb-1">{exp.company}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2 mb-3">
                                            {exp.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{exp.location}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(exp.startDate).toLocaleDateString()} -{' '}
                                                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                                                </span>
                                            </div>
                                        </div>

                                        {exp.description && <p className="text-gray-400 text-sm leading-relaxed mb-3">{exp.description}</p>}

                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <div className="bg-[#232a36]/50 rounded-lg p-3 border border-[#232a36]">
                                                <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Key Achievements</p>
                                                <ul className="space-y-1">
                                                    {exp.achievements.map((achievement, idx) => (
                                                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                                            <span className="mt-1.5 w-1.5 h-1.5 bg-[#3b82f6] rounded-full flex-shrink-0" />
                                                            {achievement}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => setEditingId(exp.id)}
                                            className="p-2 text-blue-400 hover:bg-[#232a36] rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (confirm('Delete this work experience?')) {
                                                    try {
                                                        await workExperienceApi.delete(exp.id);
                                                        toast.success('Experience deleted');
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
                        <h3 className="font-bold text-white text-lg">Add New Experience</h3>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="p-2 hover:bg-[#232a36] rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <WorkExperienceForm
                        profileId={profileId}
                        onSuccess={() => {
                            setIsAdding(false);
                            handleUpdate();
                        }}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            )}

            {experiences.length === 0 && !isAdding && (
                <div className="text-center py-12 bg-[#181c24] rounded-xl border border-[#232a36] border-dashed">
                    <div className="w-16 h-16 bg-[#232a36] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-lg mb-2">No work experience yet</p>
                    <p className="text-gray-500 text-sm mb-6">Add your professional work history</p>
                    <button
                        onClick={() => setIsAdding(true)}
                        disabled={!profileId}
                        className="px-6 py-2 bg-[#232a36] text-blue-400 hover:text-blue-300 hover:bg-[#2a3241] rounded-xl transition-all font-medium inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Experience
                    </button>
                </div>
            )}
        </div>
    );
}

interface WorkExperienceFormProps {
    profileId: string;
    initialData?: WorkExperienceFormData;
    experienceId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function WorkExperienceForm({ profileId, initialData, experienceId, onSuccess, onCancel }: WorkExperienceFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<WorkExperienceFormData>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            profileId,
            company: initialData?.company || '',
            position: initialData?.position || '',
            location: initialData?.location || '',
            startDate: initialData?.startDate || '',
            endDate: initialData?.endDate || '',
            description: initialData?.description || '',
            achievements: initialData?.achievements || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: control as any,
        name: 'achievements',
    });

    const onSubmit = async (data: WorkExperienceFormData) => {
        setIsSubmitting(true);
        try {
            if (experienceId) {
                await workExperienceApi.update(experienceId, data);
            } else {
                await workExperienceApi.create(data);
            }
            toast.success(experienceId ? 'Experience updated!' : 'Experience added!');
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
                    <label className={labelClasses}>Company *</label>
                    <input
                        {...register('company')}
                        type="text"
                        className={inputClasses}
                        placeholder="Google"
                    />
                    {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Position *</label>
                    <input
                        {...register('position')}
                        type="text"
                        className={inputClasses}
                        placeholder="Senior Software Engineer"
                    />
                    {errors.position && <p className="text-red-400 text-sm mt-1">{errors.position.message}</p>}
                </div>
            </div>

            <div>
                <label className={labelClasses}>Location</label>
                <input
                    {...register('location')}
                    type="text"
                    className={inputClasses}
                    placeholder="San Francisco, CA"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Start Date *</label>
                    <input
                        {...register('startDate')}
                        type="date"
                        className={inputClasses}
                    />
                    {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>}
                </div>

                <div>
                    <label className={labelClasses}>End Date</label>
                    <input
                        {...register('endDate')}
                        type="date"
                        className={inputClasses}
                    />
                </div>
            </div>

            <div>
                <label className={labelClasses}>Description</label>
                <textarea
                    {...register('description')}
                    rows={3}
                    className={inputClasses}
                    placeholder="Brief description of your role..."
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className={labelClasses}>Achievements</label>
                    <button
                        type="button"
                        onClick={() => append('')}
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                    >
                        + Add Achievement
                    </button>
                </div>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <input
                                {...register(`achievements.${index}` as const)}
                                type="text"
                                className={inputClasses}
                                placeholder="Led team of 5 engineers..."
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
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
                    {isSubmitting ? 'Saving...' : experienceId ? 'Update' : 'Add'}
                </button>
            </div>
        </form>
    );
}
