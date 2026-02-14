'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormData } from '@/lib/validations/schemas';
import { profileApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useState } from 'react';

import ImageUpload from '@/components/ui/ImageUpload';

interface ProfileFormProps {
    initialData?: ProfileFormData;
    profileId?: string;
    onSuccess?: () => void;
}

export default function ProfileForm({ initialData, profileId, onSuccess }: ProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: initialData || {
            fullName: '',
            phone: '',
            location: '',
            linkedinUrl: '',
            githubUrl: '',
            portfolioUrl: '',
            professionalSummary: '',
            profilePictureUrl: '',
        },
    });

    const handleImageUploadSuccess = (url: string) => {
        setValue('profilePictureUrl', url);
        toast.success('Profile picture updated!');
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true);
        try {
            if (profileId) {
                await profileApi.update(profileId, data);
                toast.success('Profile updated successfully!');
            } else {
                await profileApi.create(data);
                toast.success('Profile created successfully!');
            }
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save profile');
            console.error('Profile save error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center mb-6">
                <ImageUpload
                    currentImageUrl={initialData?.profilePictureUrl}
                    onUploadSuccess={handleImageUploadSuccess}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                    Full Name *
                </label>
                <input
                    {...register('fullName')}
                    type="text"
                    className="w-full px-4 py-2 bg-[#181c24] border border-[#232a36] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    placeholder="John Doe"
                />
                {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                        Phone
                    </label>
                    <input
                        {...register('phone')}
                        type="tel"
                        className="w-full px-4 py-2 bg-[#181c24] border border-[#232a36] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                        Location
                    </label>
                    <input
                        {...register('location')}
                        type="text"
                        className="w-full px-4 py-2 bg-[#181c24] border border-[#232a36] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                        placeholder="San Francisco, CA"
                    />
                    {errors.location && (
                        <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                        LinkedIn URL
                    </label>
                    <input
                        {...register('linkedinUrl')}
                        type="url"
                        className="w-full px-4 py-2 bg-[#181c24] border border-[#232a36] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                        placeholder="https://linkedin.com/in/..."
                    />
                    {errors.linkedinUrl && (
                        <p className="text-red-400 text-sm mt-1">{errors.linkedinUrl.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                        GitHub URL
                    </label>
                    <input
                        {...register('githubUrl')}
                        type="url"
                        className="w-full px-4 py-2 bg-[#181c24] border border-[#232a36] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                        placeholder="https://github.com/..."
                    />
                    {errors.githubUrl && (
                        <p className="text-red-400 text-sm mt-1">{errors.githubUrl.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                        Portfolio URL
                    </label>
                    <input
                        {...register('portfolioUrl')}
                        type="url"
                        className="w-full px-4 py-2 bg-[#181c24] border border-[#232a36] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                        placeholder="https://..."
                    />
                    {errors.portfolioUrl && (
                        <p className="text-red-400 text-sm mt-1">{errors.portfolioUrl.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                    Professional Summary
                </label>
                <textarea
                    {...register('professionalSummary')}
                    rows={4}
                    className="w-full px-4 py-2 bg-[#181c24] border border-[#232a36] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    placeholder="Brief summary of your professional background and key achievements..."
                />
                {errors.professionalSummary && (
                    <p className="text-red-400 text-sm mt-1">{errors.professionalSummary.message}</p>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#181c24]">
                <button
                    type="button"
                    className="px-4 py-2 text-blue-200 bg-[#181c24] rounded-xl hover:bg-[#1f242e] transition-colors"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
