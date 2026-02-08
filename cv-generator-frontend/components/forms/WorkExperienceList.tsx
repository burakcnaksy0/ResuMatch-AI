'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workExperienceSchema, WorkExperienceFormData } from '@/lib/validations/schemas';
import { workExperienceApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { WorkExperience } from '@/types';

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
        fetchExperiences();
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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding work experience.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Work Experience</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Add Experience
                </button>
            </div>

            <div className="space-y-4">
                {experiences.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                        {editingId === exp.id ? (
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
                        ) : (
                            <div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{exp.position}</h3>
                                        <p className="text-gray-800 font-medium">{exp.company}</p>
                                        {exp.location && <p className="text-gray-700">{exp.location}</p>}
                                        <p className="text-sm text-gray-600">
                                            {new Date(exp.startDate).toLocaleDateString()} -{' '}
                                            {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingId(exp.id)}
                                            className="text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            Edit
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
                                            className="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {exp.description && <p className="mt-2 text-gray-800 text-sm">{exp.description}</p>}
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="mt-2 list-disc list-inside space-y-1">
                                        {exp.achievements.map((achievement, idx) => (
                                            <li key={idx} className="text-sm text-gray-700">{achievement}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-4">Add New Experience</h3>
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
                <p className="text-gray-500 text-center py-8">No work experience yet.</p>
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
                toast.success('Experience updated!');
            } else {
                await workExperienceApi.create(data);
                toast.success('Experience added!');
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                    <input
                        {...register('company')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Google"
                    />
                    {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                    <input
                        {...register('position')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Senior Software Engineer"
                    />
                    {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                    {...register('location')}
                    type="text"
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="San Francisco, CA"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                        {...register('startDate')}
                        type="date"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        {...register('endDate')}
                        type="date"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your role..."
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Achievements</label>
                    <button
                        type="button"
                        onClick={() => append('')}
                        className="text-sm text-blue-600 hover:text-blue-700"
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
                                className="flex-1 px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Led team of 5 engineers..."
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="px-3 py-2 text-red-600 hover:text-red-700"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
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
                    {isSubmitting ? 'Saving...' : experienceId ? 'Update' : 'Add'}
                </button>
            </div>
        </form>
    );
}
