import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');

                // Avoid infinite redirect loop if already on login page
                if (!window.location.pathname.includes('/auth/login')) {
                    window.location.href = '/auth/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    googleLogin: (token: string) => api.post('/auth/google-login', { token }),
    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, newPassword: string) => api.post('/auth/reset-password', { token, newPassword }),
    verifyEmail: (code: string) => api.post('/auth/verify-email', { code }),
    resendVerification: () => api.post('/auth/resend-verification'),
    changePassword: (data: any) => api.post('/auth/change-password', data),
};

// Profile API
export const profileApi = {
    create: (data: any) => api.post('/profile', data),
    getAll: () => api.get('/profile'),
    getById: (id: string) => api.get(`/profile/${id}`),
    getByUserId: (userId: string) => api.get(`/profile/user/${userId}`),
    getMe: () => api.get('/profile/me'),
    update: (id: string, data: any) => api.patch(`/profile/${id}`, data),
    delete: (id: string) => api.delete(`/profile/${id}`),
    uploadPhoto: (formData: FormData) => api.post('/profile/upload-photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

// Generated CV API
export const generatedCVApi = {
    generate: (data: {
        profileId: string;
        jobPostingId?: string;
        userId: string;
        includeProfilePicture?: boolean;
        tone?: string;
        cvSpecificPhotoUrl?: string;
        templateName?: string;
    }) => api.post('/generated-cv/generate', data),
    uploadPhoto: (formData: FormData) => api.post('/generated-cv/upload-photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    update: (id: string, data: any) => api.patch(`/generated-cv/${id}`, data),
    getAll: (userId: string) => api.get(`/generated-cv?userId=${userId}`),
    getById: (id: string, userId: string) => api.get(`/generated-cv/${id}?userId=${userId}`),
    generatePdf: (id: string) => api.post(`/generated-cv/${id}/pdf`),
    downloadPdf: (id: string) => api.get(`/generated-cv/${id}/download`, { responseType: 'blob' }),
    delete: (id: string, userId: string) => api.delete(`/generated-cv/${id}?userId=${userId}`),
    getTemplates: () => api.get('/generated-cv/templates'),
};

// Template types
export interface CVTemplate {
    id: string;
    name: string;
    category: string;
    description: string;
    isPro: boolean;
    layout: string;
    colorScheme: string;
    features: string[];
    preview: string;
    bestFor: string[];
}

// Education API
export const educationApi = {
    create: (data: any) => api.post('/education', data),
    getAllByProfile: (profileId: string) => api.get(`/education?profileId=${profileId}`),
    getById: (id: string) => api.get(`/education/${id}`),
    update: (id: string, data: any) => api.patch(`/education/${id}`, data),
    delete: (id: string) => api.delete(`/education/${id}`),
};

// Work Experience API
export const workExperienceApi = {
    create: (data: any) => api.post('/work-experience', data),
    getAllByProfile: (profileId: string) => api.get(`/work-experience?profileId=${profileId}`),
    getById: (id: string) => api.get(`/work-experience/${id}`),
    update: (id: string, data: any) => api.patch(`/work-experience/${id}`, data),
    delete: (id: string) => api.delete(`/work-experience/${id}`),
};

// Skill API
export const skillApi = {
    create: (data: any) => api.post('/skill', data),
    getAllByProfile: (profileId: string) => api.get(`/skill?profileId=${profileId}`),
    getById: (id: string) => api.get(`/skill/${id}`),
    update: (id: string, data: any) => api.patch(`/skill/${id}`, data),
    delete: (id: string) => api.delete(`/skill/${id}`),
};

// Project API
export const projectApi = {
    create: (data: any) => api.post('/project', data),
    getAllByProfile: (profileId: string) => api.get(`/project?profileId=${profileId}`),
    getById: (id: string) => api.get(`/project/${id}`),
    update: (id: string, data: any) => api.patch(`/project/${id}`, data),
    delete: (id: string) => api.delete(`/project/${id}`),
};

// Certification API
export const certificationApi = {
    create: (data: any) => api.post('/certification', data),
    getAllByProfile: (profileId: string) => api.get(`/certification?profileId=${profileId}`),
    getById: (id: string) => api.get(`/certification/${id}`),
    update: (id: string, data: any) => api.patch(`/certification/${id}`, data),
    delete: (id: string) => api.delete(`/certification/${id}`),
};

// Language API
export const languageApi = {
    getAll: (profileId: string) => api.get(`/language?profileId=${profileId}`),
    getOne: (id: string) => api.get(`/language/${id}`),
    create: (data: any) => api.post('/language', data),
    update: (id: string, data: any) => api.patch(`/language/${id}`, data),
    delete: (id: string) => api.delete(`/language/${id}`),
};

// Job Posting API
export const jobPostingApi = {
    getAll: (userId: string) => api.get(`/job-postings?userId=${userId}`),
    getOne: (id: string, userId: string) => api.get(`/job-postings/${id}?userId=${userId}`),
    create: (data: any) => api.post('/job-postings', data),
    update: (id: string, userId: string, data: any) => api.patch(`/job-postings/${id}?userId=${userId}`, data),
    delete: (id: string, userId: string) => api.delete(`/job-postings/${id}?userId=${userId}`),
    analyze: (id: string, userId: string) => api.get(`/job-postings/${id}/analyze?userId=${userId}`),
};

// Subscription API
export const subscriptionApi = {
    getStatus: () => api.get('/subscription/status'),
    getPricing: () => api.get('/subscription/pricing'),
    upgrade: (billingCycle: 'monthly' | 'yearly') => api.post('/subscription/upgrade', { billingCycle }),
    downgrade: () => api.post('/subscription/downgrade'),
};
