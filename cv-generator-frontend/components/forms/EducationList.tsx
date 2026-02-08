'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, EducationFormData } from '@/lib/validations/schemas';
import { educationApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Education } from '@/types';

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
        fetchEducations();
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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding education.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Education</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Add Education
                </button>
            </div>

            {/* Existing Education Entries */}
            <div className="space-y-4">
                {educations.map((edu) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                        {editingId === edu.id ? (
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
                        ) : (
                            <div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{edu.degree}</h3>
                                        <p className="text-gray-800 font-medium">{edu.institution}</p>
                                        {edu.fieldOfStudy && <p className="text-gray-700">{edu.fieldOfStudy}</p>}
                                        <p className="text-sm text-gray-600">
                                            {new Date(edu.startDate).toLocaleDateString()} -{' '}
                                            {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                                        </p>
                                        {edu.gpa && <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingId(edu.id)}
                                            className="text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            Edit
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
                                            className="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {edu.description && <p className="mt-2 text-gray-600 text-sm">{edu.description}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add New Education Form */}
            {isAdding && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-4">Add New Education</h3>
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
                <p className="text-gray-500 text-center py-8">No education entries yet. Click "Add Education" to get started.</p>
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
                toast.success('Education updated successfully!');
            } else {
                await educationApi.create(data);
                toast.success('Education added successfully!');
            }
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save education');
            console.error('Education save error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution *
                    </label>
                    <input
                        {...register('institution')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="University of California"
                    />
                    {errors.institution && (
                        <p className="text-red-500 text-sm mt-1">{errors.institution.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree *
                    </label>
                    <input
                        {...register('degree')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Bachelor of Science"
                    />
                    {errors.degree && (
                        <p className="text-red-500 text-sm mt-1">{errors.degree.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study
                </label>
                <input
                    {...register('fieldOfStudy')}
                    type="text"
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Computer Science"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                    </label>
                    <input
                        {...register('startDate')}
                        type="date"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        {...register('endDate')}
                        type="date"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        GPA
                    </label>
                    <input
                        {...register('gpa', { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="3.8"
                    />
                    {errors.gpa && (
                        <p className="text-red-500 text-sm mt-1">{errors.gpa.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Relevant coursework, achievements, honors..."
                />
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
                    {isSubmitting ? 'Saving...' : educationId ? 'Update' : 'Add'}
                </button>
            </div>
        </form>
    );
}
