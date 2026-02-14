'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Mail, Lock, ArrowRight, Sparkles, CheckCircle, Shield, Zap, Target } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register: registerUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsSubmitting(true);
        try {
            await registerUser({ email: data.email, password: data.password });
        } catch (error) {
            // Error handled in AuthContext
        } finally {
            setIsSubmitting(false);
        }
    };

    const benefits = [
        { icon: Sparkles, text: 'AI-powered CV optimization' },
        { icon: Zap, text: 'Generate CVs in seconds' },
        { icon: Target, text: 'Job-specific tailoring' },
        { icon: CheckCircle, text: 'ATS-friendly templates' },
    ];

    return (
        <div className="flex min-h-screen bg-[#10131a]">
            {/* Left Side - Branding & Benefits */}
            <div className="hidden lg:flex lg:flex-1 flex-col justify-between bg-[#181c24] border-r border-[#232a36] p-12 text-white relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
                    <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-[#232a36] shadow-lg group-hover:bg-[#2a3241] transition-all duration-300 border border-[#2a3241]">
                            <Image
                                src="/logo.png"
                                alt={APP_NAME}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-2xl font-bold">{APP_NAME}</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#232a36] border border-[#3b82f6]/30">
                            <Shield className="w-4 h-4 text-[#3b82f6]" />
                            <span className="text-sm font-medium text-blue-200">100% Free • No Credit Card Required</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            Start creating
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                job-winning CVs
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400">
                            Join thousands of professionals who landed their dream jobs with AI-powered CVs
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-6 pt-4">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex flex-col items-start gap-3 p-4 bg-[#232a36] rounded-xl border border-[#2a3241] hover:border-[#3b82f6]/50 transition-colors">
                                <div className="w-10 h-10 bg-[#181c24] rounded-lg flex items-center justify-center border border-[#2a3241]">
                                    <benefit.icon className="w-5 h-5 text-[#3b82f6]" />
                                </div>
                                <span className="text-sm font-medium leading-snug text-gray-300">{benefit.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 grid grid-cols-3 gap-8 pt-8 border-t border-[#2a3241]">
                    <div>
                        <div className="text-3xl font-bold text-white">15K+</div>
                        <div className="text-sm text-gray-400">Active Users</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">50K+</div>
                        <div className="text-sm text-gray-400">CVs Created</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">94%</div>
                        <div className="text-sm text-gray-400">Success Rate</div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-[#10131a]">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="p-2 bg-[#232a36] rounded-lg border border-[#2a3241]">
                                <Briefcase className="w-6 h-6 text-[#3b82f6]" />
                            </div>
                            <span className="text-xl font-bold text-white">{APP_NAME}</span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold text-white">
                            Create your free account
                        </h2>
                        <p className="text-gray-400">
                            Start creating professional CVs in minutes
                        </p>
                    </div>

                    {/* Social Sign Up Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-[#2a3241] rounded-xl text-sm font-medium text-gray-300 bg-[#181c24] hover:bg-[#232a36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] focus:ring-offset-[#10131a] transition-all duration-200"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-[#2a3241] rounded-xl text-sm font-medium text-gray-300 bg-[#181c24] hover:bg-[#232a36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] focus:ring-offset-[#10131a] transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#2a3241]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#10131a] text-gray-500">Or sign up with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email-address" className="block text-sm font-medium text-blue-200">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    {...register('email')}
                                    id="email-address"
                                    type="email"
                                    autoComplete="email"
                                    className={`block w-full pl-12 pr-4 py-3 bg-[#181c24] border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all duration-200 ${errors.email
                                        ? 'border-red-500/50 focus:ring-red-500'
                                        : 'border-[#2a3241]'
                                        }`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-sm flex items-center gap-1">
                                    <span className="text-lg">⚠</span>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-blue-200">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    {...register('password')}
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    className={`block w-full pl-12 pr-4 py-3 bg-[#181c24] border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all duration-200 ${errors.password
                                        ? 'border-red-500/50 focus:ring-red-500'
                                        : 'border-[#2a3241]'
                                        }`}
                                    placeholder="Create a strong password"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-sm flex items-center gap-1">
                                    <span className="text-lg">⚠</span>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-blue-200">
                                Confirm password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    {...register('confirmPassword')}
                                    id="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    className={`block w-full pl-12 pr-4 py-3 bg-[#181c24] border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all duration-200 ${errors.confirmPassword
                                        ? 'border-red-500/50 focus:ring-red-500'
                                        : 'border-[#2a3241]'
                                        }`}
                                    placeholder="Confirm your password"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-sm flex items-center gap-1">
                                    <span className="text-lg">⚠</span>
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 mt-0.5 text-[#3b82f6] focus:ring-[#3b82f6] border-[#2a3241] bg-[#181c24] rounded"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                                I agree to the{' '}
                                <Link href="/terms" className="font-medium text-[#3b82f6] hover:text-blue-400">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="font-medium text-[#3b82f6] hover:text-blue-400">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] focus:ring-offset-[#10131a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating your account...
                                </>
                            ) : (
                                <>
                                    Create free account
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {/* Features Note */}
                        <div className="bg-[#181c24] rounded-xl p-4 border border-[#2a3241]">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-gray-300">
                                    <span className="font-semibold text-white">100% Free Forever.</span> No credit card required. Start creating unlimited CVs immediately.
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link
                                href="/auth/login"
                                className="font-semibold text-[#3b82f6] hover:text-blue-400 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}