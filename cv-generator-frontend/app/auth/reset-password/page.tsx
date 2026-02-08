'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
    Lock, 
    CheckCircle, 
    Eye, 
    EyeOff, 
    Shield, 
    Briefcase,
    AlertCircle,
    ArrowLeft,
    Sparkles
} from 'lucide-react';

function ResetPasswordForm() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);

    const password = watch('password');

    // Password strength checker
    const getPasswordStrength = (pwd: string) => {
        if (!pwd) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (pwd.length >= 6) strength++;
        if (pwd.length >= 10) strength++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;

        if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 4) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
        return { strength: 4, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(password || '');

    if (!token) {
        return (
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-full">
                        <AlertCircle className="w-16 h-16 text-red-600" />
                    </div>
                    
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Invalid Reset Link
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left">
                        <h3 className="font-semibold text-red-900 mb-2">Common reasons:</h3>
                        <ul className="space-y-2 text-sm text-red-700">
                            <li className="flex gap-2">
                                <span>•</span>
                                <span>Link has expired (valid for 1 hour only)</span>
                            </li>
                            <li className="flex gap-2">
                                <span>•</span>
                                <span>Link has already been used</span>
                            </li>
                            <li className="flex gap-2">
                                <span>•</span>
                                <span>Link was copied incorrectly</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/auth/forgot-password')}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-200"
                        >
                            Request New Reset Link
                        </button>
                        <Link
                            href="/auth/login"
                            className="block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await authApi.resetPassword(token, data.password);
            setPasswordReset(true);
            toast.success('Password reset successfully!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reset password. Token may be expired.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (passwordReset) {
        return (
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                    
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Password Reset Successfully!
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Your password has been changed successfully. You can now log in with your new password.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900 text-left">
                                <p className="font-semibold mb-2">Security tips:</p>
                                <ul className="space-y-1 text-blue-700">
                                    <li>• Don't share your password with anyone</li>
                                    <li>• Use a unique password for each account</li>
                                    <li>• Consider using a password manager</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/auth/login')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-200"
                    >
                        Continue to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left space-y-3">
                <div className="inline-flex p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mb-4">
                    <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                    Set a new password
                </h2>
                <p className="text-gray-600">
                    Create a strong password to secure your account
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* New Password Field */}
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className={`block w-full pl-12 pr-12 py-3 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 ${
                                errors.password 
                                    ? 'border-red-300 focus:ring-red-600' 
                                    : 'border-gray-300'
                            }`}
                            placeholder="Enter new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                            <span className="text-lg">⚠</span>
                            {errors.password.message as string}
                        </p>
                    )}

                    {/* Password Strength Indicator */}
                    {password && password.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Password strength:</span>
                                <span className={`font-semibold ${
                                    passwordStrength.strength === 1 ? 'text-red-600' :
                                    passwordStrength.strength === 2 ? 'text-yellow-600' :
                                    passwordStrength.strength === 3 ? 'text-blue-600' :
                                    'text-green-600'
                                }`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                                            level <= passwordStrength.strength
                                                ? passwordStrength.color
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: value => value === password || "Passwords do not match"
                            })}
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`block w-full pl-12 pr-12 py-3 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 ${
                                errors.confirmPassword 
                                    ? 'border-red-300 focus:ring-red-600' 
                                    : 'border-gray-300'
                            }`}
                            placeholder="Confirm new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                            <span className="text-lg">⚠</span>
                            {errors.confirmPassword.message as string}
                        </p>
                    )}
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Password requirements:</h4>
                    <ul className="space-y-2 text-xs text-gray-600">
                        <li className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${password?.length >= 6 ? 'text-green-600' : 'text-gray-300'}`} />
                            <span>At least 6 characters</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${/[A-Z]/.test(password || '') && /[a-z]/.test(password || '') ? 'text-green-600' : 'text-gray-300'}`} />
                            <span>Mix of uppercase and lowercase letters</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${/\d/.test(password || '') ? 'text-green-600' : 'text-gray-300'}`} />
                            <span>At least one number</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${/[!@#$%^&*(),.?":{}|<>]/.test(password || '') ? 'text-green-600' : 'text-gray-300'}`} />
                            <span>At least one special character</span>
                        </li>
                    </ul>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Resetting Password...
                        </>
                    ) : (
                        <>
                            <Shield className="w-5 h-5" />
                            Reset Password
                        </>
                    )}
                </button>

                {/* Back to Login */}
                <div className="text-center">
                    <Link 
                        href="/auth/login" 
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:flex-1 flex-col justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 text-white relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <span className="text-2xl font-bold">CV Generator AI</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Secure Password Reset</span>
                        </div>
                        
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            Almost there!
                            <br />
                            One more step
                        </h1>
                        
                        <p className="text-xl text-purple-100">
                            Create a strong password and regain access to your account
                        </p>
                    </div>

                    {/* Security Tips */}
                    <div className="space-y-4 pt-4">
                        {[
                            'Use a mix of characters',
                            'Make it unique',
                            'At least 6 characters long',
                            'Avoid common words'
                        ].map((tip, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span className="text-lg">{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <Shield className="w-8 h-8" />
                        <div>
                            <p className="font-semibold">Secure & Encrypted</p>
                            <p className="text-sm text-purple-100">Your data is protected with industry-standard encryption</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">CV Generator AI</span>
                        </Link>
                    </div>

                    <Suspense fallback={
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Loading...</p>
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}