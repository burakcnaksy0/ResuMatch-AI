'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobPostingSchema, JobPostingFormData } from '@/lib/validations/job-posting-schema';
import { jobPostingApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Briefcase, Building, Link as LinkIcon, FileText, ChevronRight } from 'lucide-react';

interface JobPostingFormProps {
    userId: string;
    initialData?: Partial<JobPostingFormData>;
    jobPostingId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function JobPostingForm({ userId, initialData, jobPostingId, onSuccess, onCancel }: JobPostingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<JobPostingFormData>({
        resolver: zodResolver(jobPostingSchema),
        defaultValues: {
            userId: userId,
            jobTitle: initialData?.jobTitle || '',
            company: initialData?.company || '',
            jobUrl: initialData?.jobUrl || '',
            jobDescription: initialData?.jobDescription || '',
            experienceLevel: initialData?.experienceLevel || '',
            requiredSkills: initialData?.requiredSkills || [],
        },
    });

    const onSubmit = async (data: JobPostingFormData) => {
        setIsSubmitting(true);
        try {
            // Ensure userId is present (though it should be from defaultValues)
            const submissionData = { ...data, userId };

            if (jobPostingId) {
                await jobPostingApi.update(jobPostingId, userId, submissionData);
            } else {
                await jobPostingApi.create(submissionData);
            }
            toast.success(jobPostingId ? 'Job posting updated!' : 'Job posting created!');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save job posting');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full pl-10 pr-4 py-3 bg-[#181c24] border border-[#2a3241] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all shadow-sm";
    const labelClasses = "block text-sm font-medium text-blue-200 mb-1.5 ml-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...register('userId')} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Job Title *</label>
                    <div className="relative group">
                        <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#3b82f6] transition-colors" />
                        <input
                            {...register('jobTitle')}
                            type="text"
                            className={inputClasses}
                            placeholder="Senior Software Engineer"
                        />
                    </div>
                    {errors.jobTitle && <p className="text-red-400 text-sm mt-1 ml-1">{errors.jobTitle.message}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Company *</label>
                    <div className="relative group">
                        <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#3b82f6] transition-colors" />
                        <input
                            {...register('company')}
                            type="text"
                            className={inputClasses}
                            placeholder="Google"
                        />
                    </div>
                    {errors.company && <p className="text-red-400 text-sm mt-1 ml-1">{errors.company.message}</p>}
                </div>
            </div>

            <div>
                <label className={labelClasses}>Job URL</label>
                <div className="relative group">
                    <LinkIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#3b82f6] transition-colors" />
                    <input
                        {...register('jobUrl')}
                        type="url"
                        className={inputClasses}
                        placeholder="https://linkedin.com/jobs/..."
                    />
                </div>
                {errors.jobUrl && <p className="text-red-400 text-sm mt-1 ml-1">{errors.jobUrl.message}</p>}
            </div>

            <div>
                <label className={labelClasses}>Experience Level</label>
                <div className="relative group">
                    <ChevronRight className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#3b82f6] transition-colors" />
                    <select
                        {...register('experienceLevel')}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                        <option value="">Select Level...</option>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Junior">Junior</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior">Senior</option>
                        <option value="Lead">Lead</option>
                        <option value="Manager">Manager</option>
                        <option value="Executive">Executive</option>
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClasses}>Job Description *</label>
                <div className="relative group">
                    <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#3b82f6] transition-colors" />
                    <textarea
                        {...register('jobDescription')}
                        rows={6}
                        className={`${inputClasses} !pl-10 resize-none`}
                        placeholder="Paste the full job description here..."
                    />
                </div>
                {errors.jobDescription && <p className="text-red-400 text-sm mt-1 ml-1">{errors.jobDescription.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-[#232a36]">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 text-blue-200 bg-[#232a36] rounded-xl hover:bg-[#2a3241] transition-colors font-medium border border-[#2a3241]"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-8 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20 font-medium flex items-center gap-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>Saving...</>
                    ) : (
                        <>{jobPostingId ? 'Update Job' : 'Create Job'}</>
                    )}
                </button>
            </div>
        </form>
    );
}
