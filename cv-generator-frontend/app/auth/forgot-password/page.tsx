'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle, Briefcase, Shield, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [sentEmail, setSentEmail] = useState('');
    const router = useRouter();

    const onSubmit = async (data: { email: string }) => {
        setIsSubmitting(true);
        try {
            await authApi.forgotPassword(data.email);
            setSentEmail(data.email);
            setEmailSent(true);
            toast.success('Reset link sent to your email!');
        } catch (error) {
            toast.error('Failed to send reset link. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:flex-1 flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 text-white relative overflow-hidden">
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
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">Secure Password Reset</span>
                        </div>
                        
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            We've got your back
                        </h1>
                        
                        <p className="text-xl text-blue-100">
                            Reset your password securely and get back to creating amazing CVs
                        </p>
                    </div>

                    {/* Security Features */}
                    <div className="space-y-4 pt-4">
                        {[
                            'Secure email verification',
                            'Encrypted reset link',
                            'Time-limited token',
                            'Easy account recovery'
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span className="text-lg">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="relative z-10 border-l-4 border-white/30 pl-6 space-y-2">
                    <p className="text-lg font-semibold">Need help?</p>
                    <p className="text-sm text-blue-100">
                        Contact our support team at support@cvgenerator.ai
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">CV Generator AI</span>
                        </Link>
                    </div>

                    {!emailSent ? (
                        /* Reset Form */
                        <>
                            {/* Header */}
                            <div className="text-center lg:text-left space-y-3">
                                <div className="inline-flex p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mb-4">
                                    <Mail className="w-8 h-8 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Reset your password
                                </h2>
                                <p className="text-gray-600">
                                    Enter your email address and we'll send you a secure link to reset your password.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            {...register('email', { 
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                            id="email-address"
                                            type="email"
                                            autoComplete="email"
                                            className={`block w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 ${
                                                errors.email 
                                                    ? 'border-red-300 focus:ring-red-600' 
                                                    : 'border-gray-300'
                                            }`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-600 text-sm flex items-center gap-1">
                                            <span className="text-lg">⚠</span>
                                            {errors.email.message}
                                        </p>
                                    )}
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
                                            Sending reset link...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-5 h-5" />
                                            Send Reset Link
                                        </>
                                    )}
                                </button>

                                {/* Security Note */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-900">
                                            <span className="font-semibold">Secure reset process.</span> The link will expire in 1 hour for your security.
                                        </div>
                                    </div>
                                </div>

                                {/* Back to Login */}
                                <div className="text-center">
                                    <Link 
                                        href="/auth/login" 
                                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* Success Message */
                        <div className="text-center space-y-6">
                            <div className="inline-flex p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full mb-4">
                                <CheckCircle className="w-16 h-16 text-green-600" />
                            </div>
                            
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Check your email
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We've sent a password reset link to
                                </p>
                                <p className="text-lg font-semibold text-blue-600">
                                    {sentEmail}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-left space-y-4">
                                <h3 className="font-semibold text-gray-900">Next steps:</h3>
                                <ol className="space-y-3 text-sm text-gray-700">
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                        <span>Check your email inbox and spam folder</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                        <span>Click the reset link (valid for 1 hour)</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                        <span>Create your new password</span>
                                    </li>
                                </ol>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-gray-600">
                                    Didn't receive the email?
                                </p>
                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    Try another email address
                                </button>
                            </div>

                            <div className="pt-6">
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Help Text */}
                    <div className="text-center pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Need help?{' '}
                            <a href="mailto:support@cvgenerator.ai" className="font-medium text-blue-600 hover:text-blue-500">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}