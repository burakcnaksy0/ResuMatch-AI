'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { profileApi } from '@/lib/api/client';
import Image from 'next/image';

interface ImageUploadProps {
    currentImageUrl?: string | null;
    onUploadSuccess: (url: string) => void;
}

export default function ImageUpload({ currentImageUrl, onUploadSuccess }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type
        if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
            toast.error('Only JPG and PNG files are allowed');
            return;
        }

        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Upload
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await profileApi.uploadPhoto(formData);
            toast.success('Photo uploaded successfully');
            if (response.data && response.data.profilePictureUrl) {
                onUploadSuccess(response.data.profilePictureUrl);
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to upload photo';
            toast.error(errorMessage);
            setPreview(currentImageUrl || null);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                {preview ? (
                    <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
                {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
                {currentImageUrl ? 'Change Photo' : 'Upload Photo'}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
