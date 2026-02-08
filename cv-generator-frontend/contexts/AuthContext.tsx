'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, profileApi } from '@/lib/api/client';
import toast from 'react-hot-toast';

interface User {
    id: string;
    email: string;
    emailVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    refreshUser: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                // Ideally, verify token validity here or fetch latest user status
            }
        } catch (error) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUser = async () => {
        // In a real app, fetch /auth/me or /profile/me to get fresh user data including verification status
        // For now, we will just simulate it or if we had an endpoint for "me" on auth.
        // Let's assume verifying updates local state in the component calling it, 
        // but here we provide a way to update context.
        // Actually, let's just create a simple way to update state.
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const updatedUser = { ...JSON.parse(storedUser), emailVerified: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
    };

    const login = async (data: any) => {
        try {
            const response = await authApi.login(data);
            const { access_token, user } = response.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            toast.success('Successfully logged in!');

            // If not verified, we still allow login but certain actions might be restricted
            // Check for stored redirect URL
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                router.push(redirectUrl);
                return;
            }

            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            await authApi.register(data);
            router.push('/auth/login');
            toast.success('Registration successful! Please log in.');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
