'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, LogOut } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';

export default function Navbar() {
    const { isAuthenticated, isLoading, logout, user } = useAuth();
    const pathname = usePathname();

    // Don't show navbar on auth pages
    const isAuthPage = pathname?.startsWith('/auth');

    if (isAuthPage) {
        return null;
    }

    return (
        <header className="px-6 lg:px-8 h-20 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-sm border border-blue-100 bg-white">
                    <Image
                        src="/logo.png"
                        alt={APP_NAME}
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                    {APP_NAME}
                </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
                {isAuthenticated && (
                    <>
                        <Link
                            href="/dashboard"
                            className={`text-sm font-medium transition-colors ${pathname === '/dashboard'
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/profile"
                            className={`text-sm font-medium transition-colors ${pathname === '/profile'
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            Profile
                        </Link>
                        <Link
                            href="/jobs"
                            className={`text-sm font-medium transition-colors ${pathname === '/jobs'
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            Jobs
                        </Link>
                        <Link
                            href="/cvs"
                            className={`text-sm font-medium transition-colors ${pathname === '/cvs'
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-blue-600'
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
                                <span className="hidden sm:block text-sm text-gray-600 font-medium">
                                    {user.email}
                                </span>
                            )}
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                            >
                                Register
                            </Link>
                        </>
                    )
                )}
            </div>
        </header>
    );
}
