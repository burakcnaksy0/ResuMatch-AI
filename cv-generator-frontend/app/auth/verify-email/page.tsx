'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { APP_NAME } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
    Mail, 
    CheckCircle, 
    ArrowRight, 
    RefreshCw,
    Briefcase,
    Shield,
    Sparkles,
    AlertCircle,
    Inbox,
    Clock
} from 'lucide-react';

export default function VerifyEmailPage() {
    const { user, refreshUser, isAuthenticated, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [step, setStep] = useState<'initial' | 'verify'>('initial');
    const [countdown, setCountdown] = useState(0);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        } else if (!isLoading && user?.emailVerified) {
            router.push('/dashboard');
        }
    }, [isLoading, isAuthenticated, user, router]);

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await authApi.verifyEmail(data.code);
            toast.success('Email verified successfully!');
            await refreshUser();
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendCode = async () => {
        setIsResending(true);
        try {
            const res = await authApi.resendVerification();
            const message = res.data?.message || 'Verification code sent';

            toast.success(message);
            setStep('verify');
            setCountdown(60); // 60 second cooldown

            if (message.includes('DEV CODE')) {
                toast('Check your spam folder or use the code shown above', {
                    icon: '📧',
                    duration: 6000
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send code');
        } finally {
            setIsResending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

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
                        <span className="text-2xl font-bold">{APP_NAME}</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">Secure Email Verification</span>
                        </div>
                        
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            Almost ready to
                            <br />
                            create amazing CVs
                        </h1>
                        
                        <p className="text-xl text-blue-100">
                            Just one quick step to secure your account and unlock all features
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4 pt-4">
                        {[
                            'Protect your account',
                            'Access all features',
                            'Secure data storage',
                            'Generate unlimited CVs'
                        ].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span className="text-lg">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="relative z-10 border-l-4 border-white/30 pl-6 space-y-2">
                    <p className="text-lg font-semibold">Quick verification</p>
                    <p className="text-sm text-blue-100">
                        Takes less than a minute to complete
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
                            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
                        </Link>
                    </div>

                    {step === 'initial' ? (
                        /* Initial Step - Send Code */
                        <>
                            {/* Header */}
                            <div className="text-center lg:text-left space-y-3">
                                <div className="inline-flex p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mb-4">
                                    <Mail className="w-8 h-8 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Verify your email
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    To ensure security, please verify your email address to access all features.
                                </p>
                            </div>

                            {/* Info Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Inbox className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-blue-900 mb-2">
                                            Verification Required
                                        </h3>
                                        <p className="text-sm text-blue-700 leading-relaxed">
                                            We need to verify that <span className="font-semibold">{user?.email}</span> belongs to you.
                                            Click the button below to receive a verification code.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Send Code Button */}
                            <button
                                onClick={handleSendCode}
                                disabled={isResending}
                                className="group w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
                            >
                                {isResending ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending code...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-5 h-5" />
                                        Send Verification Code
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {/* Alternative Actions */}
                            <div className="text-center space-y-4">
                                <button
                                    onClick={() => setStep('verify')}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    Already have a code? Enter it here
                                </button>

                                <div className="pt-4 border-t border-gray-200">
                                    <Link 
                                        href="/dashboard" 
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Skip for now, go to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Verify Step - Enter Code */
                        <>
                            {/* Header */}
                            <div className="text-center lg:text-left space-y-3">
                                <div className="inline-flex p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Check your email
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We sent a verification code to <span className="font-semibold text-gray-900">{user?.email}</span>
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Verification Code Input */}
                                <div className="space-y-2">
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                        Verification Code
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <CheckCircle className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            {...register('code', { 
                                                required: 'Verification code is required',
                                                pattern: {
                                                    value: /^\d{6}$/,
                                                    message: 'Code must be 6 digits'
                                                }
                                            })}
                                            id="code"
                                            type="text"
                                            maxLength={6}
                                            autoComplete="off"
                                            className={`block w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 text-center text-lg font-mono tracking-widest ${
                                                errors.code 
                                                    ? 'border-red-300 focus:ring-red-600' 
                                                    : 'border-gray-300'
                                            }`}
                                            placeholder="000000"
                                        />
                                    </div>
                                    {errors.code && (
                                        <p className="text-red-600 text-sm flex items-center gap-1">
                                            <span className="text-lg">⚠</span>
                                            {errors.code.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Verify Email
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Resend Section */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500">
                                            Didn't receive the code?
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSendCode}
                                    disabled={isResending || countdown > 0}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {countdown > 0 ? (
                                        <>
                                            <Clock className="w-4 h-4" />
                                            Resend in {countdown}s
                                        </>
                                    ) : isResending ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" />
                                            Resend Code
                                        </>
                                    )}
                                </button>

                                {/* Tips */}
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-amber-900">
                                            <p className="font-semibold mb-1">Can't find the email?</p>
                                            <ul className="space-y-1 text-amber-700 text-xs">
                                                <li>• Check your spam or junk folder</li>
                                                <li>• Make sure {user?.email} is correct</li>
                                                <li>• Wait a few minutes and check again</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Back Link */}
                            <div className="text-center pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setStep('initial')}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Back to previous step
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}