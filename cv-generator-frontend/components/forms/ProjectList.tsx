'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectFormData } from '@/lib/validations/schemas';
import { projectApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Project } from '@/types';

interface ProjectListProps {
    profileId: string;
    projects?: Project[];
    onUpdate?: () => void;
}

export default function ProjectList({ profileId, projects: initialProjects = [], onUpdate }: ProjectListProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profileId) {
            fetchProjects();
        }
    }, [profileId]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await projectApi.getAllByProfile(profileId);
            setProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        fetchProjects();
        onUpdate?.();
    };

    return (
        <div className="space-y-6">
            {!profileId && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding projects.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Projects</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Add Project
                </button>
            </div>

            <div className="space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                        {editingId === project.id ? (
                            <ProjectForm
                                profileId={profileId}
                                initialData={project}
                                projectId={project.id}
                                onSuccess={() => {
                                    setEditingId(null);
                                    handleUpdate();
                                }}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-900">{project.name}</h3>
                                        {project.description && <p className="text-gray-800 mt-1">{project.description}</p>}
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {project.technologies.map((tech, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                            {project.url && (
                                                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    🔗 Live Demo
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    📁 GitHub
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingId(project.id)} className="text-blue-600 hover:text-blue-700 text-sm">
                                            Edit
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (confirm('Delete this project?')) {
                                                    try {
                                                        await projectApi.delete(project.id);
                                                        toast.success('Project deleted');
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
                    <h3 className="font-semibold mb-4">Add New Project</h3>
                    <ProjectForm
                        profileId={profileId}
                        onSuccess={() => {
                            setIsAdding(false);
                            handleUpdate();
                        }}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            )}

            {projects.length === 0 && !isAdding && (
                <p className="text-gray-500 text-center py-8">No projects yet.</p>
            )}
        </div>
    );
}

interface ProjectFormProps {
    profileId: string;
    initialData?: ProjectFormData;
    projectId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function ProjectForm({ profileId, initialData, projectId, onSuccess, onCancel }: ProjectFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            profileId,
            name: initialData?.name || '',
            description: initialData?.description || '',
            technologies: initialData?.technologies || [],
            url: initialData?.url || '',
            githubUrl: initialData?.githubUrl || '',
            startDate: initialData?.startDate || '',
            endDate: initialData?.endDate || '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: control as any,
        name: 'technologies',
    });

    const onSubmit = async (data: ProjectFormData) => {
        setIsSubmitting(true);
        try {
            if (projectId) {
                await projectApi.update(projectId, data);
                toast.success('Project updated!');
            } else {
                await projectApi.create(data);
                toast.success('Project added!');
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
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input
                    {...register('name')}
                    type="text"
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E-commerce Platform"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the project..."
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Technologies</label>
                    <button
                        type="button"
                        onClick={() => append('')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        + Add Technology
                    </button>
                </div>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <input
                                {...register(`technologies.${index}` as const)}
                                type="text"
                                className="flex-1 px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="React, Node.js, MongoDB..."
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
                    <input
                        {...register('url')}
                        type="url"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                    />
                    {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                    <input
                        {...register('githubUrl')}
                        type="url"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/..."
                    />
                    {errors.githubUrl && <p className="text-red-500 text-sm mt-1">{errors.githubUrl.message}</p>}
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
                    {isSubmitting ? 'Saving...' : projectId ? 'Update' : 'Add'}
                </button>
            </div>
        </form>
    );
}
