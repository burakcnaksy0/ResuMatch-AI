'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillSchema, SkillFormData } from '@/lib/validations/schemas';
import { skillApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Skill } from '@/types';

interface SkillListProps {
    profileId: string;
    skills?: Skill[];
    onUpdate?: () => void;
}

export default function SkillList({ profileId, skills: initialSkills = [], onUpdate }: SkillListProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, [profileId]);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const response = await skillApi.getAllByProfile(profileId);
            setSkills(response.data);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        fetchSkills();
        onUpdate?.();
    };

    return (
        <div className="space-y-6">
            {!profileId && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding skills.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Skills</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Add Skill
                </button>
            </div>

            {/* Skills Grid */}
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-full"
                    >
                        <span className="font-medium">{skill.name}</span>
                        {skill.proficiencyLevel && (
                            <span className="text-xs text-blue-600">({skill.proficiencyLevel})</span>
                        )}
                        <button
                            onClick={async () => {
                                if (confirm(`Delete skill "${skill.name}"?`)) {
                                    try {
                                        await skillApi.delete(skill.id);
                                        toast.success('Skill deleted');
                                        handleUpdate();
                                    } catch (error) {
                                        toast.error('Failed to delete');
                                    }
                                }
                            }}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-4">Add New Skill</h3>
                    <SkillForm
                        profileId={profileId}
                        onSuccess={() => {
                            setIsAdding(false);
                            handleUpdate();
                        }}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            )}

            {skills.length === 0 && !isAdding && (
                <p className="text-gray-500 text-center py-8">No skills yet.</p>
            )}
        </div>
    );
}

interface SkillFormProps {
    profileId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function SkillForm({ profileId, onSuccess, onCancel }: SkillFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SkillFormData>({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            profileId,
            name: '',
            category: '',
            proficiencyLevel: '',
        },
    });

    const onSubmit = async (data: SkillFormData) => {
        setIsSubmitting(true);
        try {
            await skillApi.create(data);
            toast.success('Skill added!');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add skill');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name *</label>
                    <input
                        {...register('name')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="React"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                        {...register('category')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Frontend"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                    <select
                        {...register('proficiencyLevel')}
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select...</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
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
                    {isSubmitting ? 'Adding...' : 'Add Skill'}
                </button>
            </div>
        </form>
    );
}
