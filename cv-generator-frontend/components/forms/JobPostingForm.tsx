'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobPostingSchema, JobPostingFormData } from '@/lib/validations/job-posting-schema';
import { jobPostingApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { JobPosting } from '@/types';

interface JobPostingFormProps {
    userId: string;
    initialData?: JobPostingFormData;
    jobPostingId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function JobPostingForm({
    userId,
    initialData,
    jobPostingId,
    onSuccess,
    onCancel,
}: JobPostingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<JobPostingFormData>({
        resolver: zodResolver(jobPostingSchema),
        defaultValues: {
            userId,
            jobTitle: initialData?.jobTitle || '',
            company: initialData?.company || '',
            jobUrl: initialData?.jobUrl || '',
            jobDescription: initialData?.jobDescription || '',
            experienceLevel: initialData?.experienceLevel || '',
        },
    });

    const onSubmit = async (data: JobPostingFormData) => {
        setIsSubmitting(true);
        try {
            if (jobPostingId) {
                await jobPostingApi.update(jobPostingId, userId, data);
                toast.success('Job posting updated!');
            } else {
                await jobPostingApi.create(data);
                toast.success('Job posting created!');
            }
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save job posting');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                </label>
                <input
                    {...register('jobTitle')}
                    type="text"
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Senior Software Engineer"
                />
                {errors.jobTitle && (
                    <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                    </label>
                    <input
                        {...register('company')}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Google"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job URL
                    </label>
                    <input
                        {...register('jobUrl')}
                        type="url"
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                    />
                    {errors.jobUrl && (
                        <p className="text-red-500 text-sm mt-1">{errors.jobUrl.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                </label>
                <select
                    {...register('experienceLevel')}
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select level</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead/Principal">Lead/Principal</option>
                    <option value="Executive">Executive</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                </label>
                <textarea
                    {...register('jobDescription')}
                    rows={12}
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Paste the full job description here..."
                />
                {errors.jobDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.jobDescription.message}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                    Keywords will be automatically extracted from the description
                </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : jobPostingId ? 'Update Job' : 'Create Job'}
                </button>
            </div>
        </form>
    );
}
