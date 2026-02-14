'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Key, Mail, AlertTriangle } from 'lucide-react';

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .regex(/[A-Z]/, 'Must contain an uppercase letter')
            .regex(/[0-9]/, 'Must contain a number'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export default function SecuritySettings() {
    const { user, refreshUser } = useAuth();
    const [isResendLoading, setIsResendLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onResendVerification = async () => {
        setIsResendLoading(true);
        try {
            await authApi.resendVerification();
            toast.success('Verification email sent! Please check your inbox.');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send verification email');
        } finally {
            setIsResendLoading(false);
        }
    };

    const onChangePassword = async (data: ChangePasswordData) => {
        setIsPasswordLoading(true);
        try {
            await authApi.changePassword(data);
            toast.success('Password changed successfully');
            reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-2 bg-[#181c24] border border-[#2a3241] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all";
    const labelClasses = "block text-sm font-medium text-blue-200 mb-1";

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#232a36]">
                <Shield className="w-8 h-8 text-[#3b82f6]" />
                <div>
                    <h2 className="text-xl font-bold text-white">Security Settings</h2>
                    <p className="text-sm text-gray-400">Manage your account security and password</p>
                </div>
            </div>

            {/* Email Verification Section */}
            <div className="bg-[#181c24] border border-[#232a36] rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${user?.emailVerified ? 'bg-green-900/20 text-green-400' : 'bg-amber-900/20 text-amber-400'}`}>
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Email Verification</h3>
                            <p className="text-gray-400 text-sm mb-2">
                                Current email: <span className="text-white font-medium">{user?.email}</span>
                            </p>
                            {user?.emailVerified ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400 border border-green-900/30">
                                    <Shield className="w-3 h-3" /> Verified Account
                                </span>
                            ) : (
                                <div className="space-y-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-900/20 text-amber-400 border border-amber-900/30">
                                        <AlertTriangle className="w-3 h-3" /> Not Verified
                                    </span>
                                    <p className="text-sm text-gray-400">
                                        Please verify your email address to access all features.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    {!user?.emailVerified && (
                        <button
                            onClick={onResendVerification}
                            disabled={isResendLoading}
                            className="px-4 py-2 bg-[#232a36] hover:bg-[#2a3241] text-blue-400 hover:text-blue-300 rounded-xl transition-all text-sm font-medium border border-[#2a3241]"
                        >
                            {isResendLoading ? 'Sending...' : 'Resend Email'}
                        </button>
                    )}
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-[#181c24] border border-[#232a36] rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-900/20 text-blue-400 rounded-full">
                        <Key className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Change Password</h3>
                        <p className="text-sm text-gray-400">Update your password to keep your account secure</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4 max-w-md">
                    <div>
                        <label className={labelClasses}>Current Password</label>
                        <input
                            {...register('currentPassword')}
                            type="password"
                            className={inputClasses}
                            placeholder="••••••••"
                        />
                        {errors.currentPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClasses}>New Password</label>
                        <input
                            {...register('newPassword')}
                            type="password"
                            className={inputClasses}
                            placeholder="••••••••"
                        />
                        {errors.newPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClasses}>Confirm New Password</label>
                        <input
                            {...register('confirmPassword')}
                            type="password"
                            className={inputClasses}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isPasswordLoading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20 font-medium"
                        >
                            {isPasswordLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
