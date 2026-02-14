'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectFormData } from '@/lib/validations/schemas';
import { projectApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Project } from '@/types';
import { FolderKanban, Link as LinkIcon, Github, Trash2, Edit3, Plus, X } from 'lucide-react';

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
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-200 flex items-center gap-2">
                        ⚠️ Please create your profile first by filling in the Personal Info tab before adding projects.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FolderKanban className="w-6 h-6 text-[#3b82f6]" />
                    Projects
                </h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={!profileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Project
                </button>
            </div>

            <div className="space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="bg-[#181c24] border border-[#232a36] rounded-xl overflow-hidden hover:border-[#3b82f6]/50 transition-all shadow-sm">
                        {editingId === project.id ? (
                            <div className="p-6">
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
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-white mb-1">{project.name}</h3>
                                        {project.description && <p className="text-gray-400 text-sm leading-relaxed mb-3">{project.description}</p>}

                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {project.technologies.map((tech, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-[#232a36] text-blue-200 text-xs font-medium rounded-lg border border-[#2a3241]">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-4 mt-2 text-sm">
                                            {project.url && (
                                                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                                                    <LinkIcon className="w-3 h-3" /> Live Demo
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                                                    <Github className="w-3 h-3" /> GitHub
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button onClick={() => setEditingId(project.id)} className="p-2 text-blue-400 hover:bg-[#232a36] rounded-lg transition-colors" title="Edit">
                                            <Edit3 className="w-4 h-4" />
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
                        <h3 className="font-bold text-white text-lg">Add New Project</h3>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="p-2 hover:bg-[#232a36] rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
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
                <div className="text-center py-12 bg-[#181c24] rounded-xl border border-[#232a36] border-dashed">
                    <div className="w-16 h-16 bg-[#232a36] rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderKanban className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-lg mb-2">No projects yet</p>
                    <p className="text-gray-500 text-sm mb-6">Showcase your best work</p>
                    <button
                        onClick={() => setIsAdding(true)}
                        disabled={!profileId}
                        className="px-6 py-2 bg-[#232a36] text-blue-400 hover:text-blue-300 hover:bg-[#2a3241] rounded-xl transition-all font-medium inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Project
                    </button>
                </div>
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
            } else {
                await projectApi.create(data);
            }
            toast.success(projectId ? 'Project updated!' : 'Project added!');
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
            <div>
                <label className={labelClasses}>Project Name *</label>
                <input
                    {...register('name')}
                    type="text"
                    className={inputClasses}
                    placeholder="E-commerce Platform"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <label className={labelClasses}>Description</label>
                <textarea
                    {...register('description')}
                    rows={3}
                    className={inputClasses}
                    placeholder="Brief description of the project..."
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className={labelClasses}>Technologies</label>
                    <button
                        type="button"
                        onClick={() => append('')}
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium"
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
                                className={inputClasses}
                                placeholder="React, Node.js, MongoDB..."
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Project URL</label>
                    <input
                        {...register('url')}
                        type="url"
                        className={inputClasses}
                        placeholder="https://..."
                    />
                    {errors.url && <p className="text-red-400 text-sm mt-1">{errors.url.message}</p>}
                </div>

                <div>
                    <label className={labelClasses}>GitHub URL</label>
                    <input
                        {...register('githubUrl')}
                        type="url"
                        className={inputClasses}
                        placeholder="https://github.com/..."
                    />
                    {errors.githubUrl && <p className="text-red-400 text-sm mt-1">{errors.githubUrl.message}</p>}
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
                    {isSubmitting ? 'Saving...' : projectId ? 'Update' : 'Add'}
                </button>
            </div>
        </form>
    );
}
