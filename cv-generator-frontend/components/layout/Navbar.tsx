'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, LogOut, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';
import FeedbackModal from '@/components/modals/FeedbackModal';

export default function Navbar() {
    const { isAuthenticated, isLoading, logout, user } = useAuth();
    const pathname = usePathname();
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    // Don't show navbar on auth pages
    const isAuthPage = pathname?.startsWith('/auth');

    if (isAuthPage) {
        return null;
    }

    return (
        <header className="px-6 lg:px-8 h-20 flex items-center justify-between bg-[#181c24]/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#232a36] shadow-sm">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-sm border border-[#3b82f6] bg-[#232a36]">
                    <Image
                        src="/logo.png"
                        alt={APP_NAME}
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#6366f1]">
                    {APP_NAME}
                </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
                {isAuthenticated && (
                    <>
                        <Link
                            href="/dashboard"
                            className={`text-sm font-medium transition-colors ${pathname === '/dashboard'
                                ? 'text-[#3b82f6]'
                                : 'text-blue-200 hover:text-[#3b82f6]'
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/profile"
                            className={`text-sm font-medium transition-colors ${pathname === '/profile'
                                ? 'text-[#3b82f6]'
                                : 'text-blue-200 hover:text-[#3b82f6]'
                                }`}
                        >
                            Profile
                        </Link>
                        <Link
                            href="/jobs"
                            className={`text-sm font-medium transition-colors ${pathname === '/jobs'
                                ? 'text-[#3b82f6]'
                                : 'text-blue-200 hover:text-[#3b82f6]'
                                }`}
                        >
                            Jobs
                        </Link>
                        <Link
                            href="/cvs"
                            className={`text-sm font-medium transition-colors ${pathname === '/cvs'
                                ? 'text-[#3b82f6]'
                                : 'text-blue-200 hover:text-[#3b82f6]'
                                }`}
                        >
                            My CVs
                        </Link>
                    </>
                )}
            </nav>

            <div className="flex items-center gap-4">
                {!isLoading && (
                    isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            {user?.email && (
                                <span className="hidden sm:block text-sm text-blue-200 font-medium">
                                    {user.email}
                                </span>
                            )}
                            <button
                                onClick={() => setIsFeedbackModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-200 bg-[#232a36] rounded-full hover:bg-[#2d3544] hover:text-white transition-all border border-[#3b82f6]/30"
                                title="Send Feedback"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span className="hidden sm:inline">Feedback</span>
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-900"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="hidden sm:block text-sm font-semibold text-blue-200 hover:text-[#3b82f6] transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#3b82f6] rounded-full hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-900"
                            >
                                Register
                            </Link>
                        </>
                    )
                )}
            </div>

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
            />
        </header>
    );
}
