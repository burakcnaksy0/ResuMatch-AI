'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { authApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { Lock, Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function SecuritySettings() {
    const { user } = useAuth();

    // Password Change Form
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm();

    const newPassword = watch('newPassword');

    const onChangePassword = async (data: any) => {
        try {
            await authApi.changePassword(data);
            toast.success('Password updated successfully');
            reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        }
    };

    return (
        <div className="space-y-8">
            {/* Email Verification Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Email Verification</h3>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Email Address</p>
                            <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {user?.emailVerified ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                                    <CheckCircle className="w-4 h-4" />
                                    Email Verified
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-200">
                                        <AlertCircle className="w-4 h-4" />
                                        Not Verified
                                    </div>
                                    <Link
                                        href="/auth/verify-email"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Verify Email
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                    </div>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                {...register('currentPassword', { required: 'Current password is required' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                            {errors.currentPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message as string}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                {...register('newPassword', {
                                    required: 'New password is required',
                                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*\d)/,
                                        message: 'Password must contain at least one uppercase letter and one number'
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message as string}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value => value === newPassword || 'Passwords do not match'
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message as string}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
