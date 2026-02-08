'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Mail, Lock, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { authApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { APP_NAME } from '@/lib/constants';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        try {
            await login(data);
        } catch (error) {
            // Error handled in AuthContext
        } finally {
            setIsSubmitting(false);
        }
    };

    const benefits = [
        'AI-powered CV optimization',
        'Unlimited CV generations',
        'ATS-friendly templates',
        'Export in multiple formats',
    ];

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Branding & Benefits */}
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
                        <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white/90 shadow-lg group-hover:bg-white transition-all duration-300">
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Join 15,000+ professionals</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            Welcome back to your
                            <br />
                            career journey
                        </h1>

                        <p className="text-xl text-blue-100">
                            Create job-winning CVs in seconds with the power of AI
                        </p>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-4 pt-4">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span className="text-lg">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="relative z-10 border-l-4 border-white/30 pl-6 space-y-3">
                    <p className="text-lg italic">
                        "This tool helped me land my dream job in just 2 weeks. The AI optimization is incredible!"
                    </p>
                    <div>
                        <p className="font-semibold">Sarah Johnson</p>
                        <p className="text-sm text-blue-100">Software Engineer at Tech Corp</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
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

                    {/* Header */}
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Sign in to your account
                        </h2>
                        <p className="text-gray-600">
                            Enter your credentials to access your dashboard
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
                                    {...register('email')}
                                    id="email-address"
                                    type="email"
                                    autoComplete="email"
                                    className={`block w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 ${errors.email
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

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('password')}
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    className={`block w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 ${errors.password
                                        ? 'border-red-300 focus:ring-red-600'
                                        : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-600 text-sm flex items-center gap-1">
                                    <span className="text-lg">⚠</span>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me for 30 days
                            </label>
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
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex justify-center">
                                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            try {
                                                if (credentialResponse.credential) {
                                                    const res = await authApi.googleLogin(credentialResponse.credential);
                                                    localStorage.setItem('access_token', res.data.access_token);
                                                    localStorage.setItem('user', JSON.stringify(res.data.user));
                                                    window.location.href = '/dashboard';
                                                }
                                            } catch (error) {
                                                console.error(error);
                                                toast.error('Google Login Failed');
                                            }
                                        }}
                                        onError={() => toast.error('Login Failed')}
                                        theme="outline"
                                        type="standard"
                                        shape="pill"
                                    />
                                </GoogleOAuthProvider>
                            </div>
                            <button
                                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                href="/auth/register"
                                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-center text-gray-500">
                        By signing in, you agree to our{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}