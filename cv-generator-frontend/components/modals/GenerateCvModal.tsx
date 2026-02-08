'use client';

import { useState, useRef, useEffect } from 'react';
import { generatedCVApi } from '@/lib/api/client';
import toast from 'react-hot-toast';

interface GenerateCvModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (options: GenerateOptions) => void;
    profilePictureUrl?: string | null;
    isGenerating: boolean;
}

export interface GenerateOptions {
    includeProfilePicture: boolean;
    cvSpecificPhotoUrl?: string; // If uploading a new one
    tone: string;
    templateName: string;
}

export default function GenerateCvModal({
    isOpen,
    onClose,
    onGenerate,
    profilePictureUrl,
    isGenerating,
}: GenerateCvModalProps) {
    const [photoOption, setPhotoOption] = useState<'none' | 'profile' | 'upload'>('none');
    const [tone, setTone] = useState('Professional');
    const [template, setTemplate] = useState('modern');
    const [templates, setTemplates] = useState<{ id: string, name: string }[]>([
        { id: 'modern', name: 'Modern (Local)' },
        { id: 'classic', name: 'Classic (Local)' }
    ]);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await generatedCVApi.getTemplates();
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    setTemplates(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch templates', err);
            }
        };
        fetchTemplates();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleGenerateClick = async () => {
        let cvSpecificPhotoUrl: string | undefined;

        if (photoOption === 'upload' && uploadedFile) {
            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', uploadedFile);
                const response = await generatedCVApi.uploadPhoto(formData);
                cvSpecificPhotoUrl = response.data.url;
            } catch (error) {
                toast.error('Failed to upload photo');
                setIsUploading(false);
                return;
            } finally {
                setIsUploading(false);
            }
        }

        onGenerate({
            includeProfilePicture: photoOption === 'profile' || photoOption === 'upload', // Backend logic might use this
            cvSpecificPhotoUrl,
            tone,
            templateName: template,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative border border-gray-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Customize Your CV</h2>

                <div className="space-y-6">
                    {/* Tone Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Professional Summary Tone
                        </label>
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full border border-gray-300 bg-white text-gray-900 font-medium rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        >
                            <option value="Professional" className="text-gray-900">Professional (Standard)</option>
                            <option value="Technical" className="text-gray-900">Technical (Focus on skills/stack)</option>
                            <option value="Leadership" className="text-gray-900">Leadership (Focus on management/impact)</option>
                            <option value="Creative" className="text-gray-900">Creative (More expressive)</option>
                            <option value="Entry-Level" className="text-gray-900">Entry-Level (Focus on potential/education)</option>
                            <option value="Academic" className="text-gray-900">Academic (Detailed & Formal)</option>
                        </select>
                        <p className="text-xs text-gray-600 mt-1 font-medium">
                            This tone will be used to rewrite your summary and experience descriptions.
                        </p>
                    </div>

                    {/* Template Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            CV Template
                        </label>
                        <select
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                            className="w-full border border-gray-300 bg-white text-gray-900 font-medium rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        >
                            {templates.map((t) => (
                                <option key={t.id} value={t.id} className="text-gray-900">
                                    {t.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-600 mt-1 font-medium">
                            Choose the visual layout for your PDF.
                        </p>
                    </div>

                    {/* Photo Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            CV Photo
                        </label>
                        <div className="space-y-3">
                            <label className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ${photoOption === 'none' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'hover:bg-gray-50 border-gray-300'}`}>
                                <input
                                    type="radio"
                                    name="photoOption"
                                    value="none"
                                    checked={photoOption === 'none'}
                                    onChange={() => setPhotoOption('none')}
                                    className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                                />
                                <span className="text-gray-900 font-medium">No Photo</span>
                            </label>

                            <label className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ${photoOption === 'profile' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'hover:bg-gray-50 border-gray-300'}`}>
                                <input
                                    type="radio"
                                    name="photoOption"
                                    value="profile"
                                    checked={photoOption === 'profile'}
                                    onChange={() => setPhotoOption('profile')}
                                    disabled={!profilePictureUrl}
                                    className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                                />
                                <div className="flex items-center gap-3 flex-1">
                                    <span className={`font-medium ${!profilePictureUrl ? 'text-gray-400' : 'text-gray-900'}`}>Use Profile Photo</span>
                                    {profilePictureUrl && (
                                        <img
                                            src={profilePictureUrl}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover border border-gray-300 shadow-sm"
                                        />
                                    )}
                                    {!profilePictureUrl && (
                                        <span className="text-xs text-red-500 font-medium ml-auto">(Not set)</span>
                                    )}
                                </div>
                            </label>

                            <label className={`flex flex-col p-3 border rounded-md cursor-pointer transition-colors ${photoOption === 'upload' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'hover:bg-gray-50 border-gray-300'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <input
                                        type="radio"
                                        name="photoOption"
                                        value="upload"
                                        checked={photoOption === 'upload'}
                                        onChange={() => setPhotoOption('upload')}
                                        className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                                    />
                                    <span className="text-gray-900 font-medium">Upload Specific Photo</span>
                                </div>
                                {photoOption === 'upload' && (
                                    <div className="ml-7 mt-1">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/png, image/jpeg"
                                            className="block w-full text-sm text-gray-700
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-bold
                                                file:bg-blue-600 file:text-white
                                                hover:file:bg-blue-700
                                                cursor-pointer"
                                        />
                                        {previewUrl && (
                                            <div className="mt-3">
                                                <p className="text-xs font-semibold text-gray-700 mb-1">Preview:</p>
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-16 h-16 object-cover rounded-md border border-gray-300 shadow-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
                        disabled={isGenerating || isUploading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerateClick}
                        disabled={isGenerating || isUploading}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors"
                    >
                        {isUploading ? 'Uploading Photo...' : isGenerating ? 'Generating CV...' : '✨ Generate CV'}
                    </button>
                </div>
            </div>
        </div>
    );
}
