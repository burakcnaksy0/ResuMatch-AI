'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { feedbackApi } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { MessageSquare, X, Send } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!description.trim()) {
            toast.error('Please enter your feedback');
            return;
        }

        if (description.trim().length < 10) {
            toast.error('Feedback must be at least 10 characters long');
            return;
        }

        setIsSubmitting(true);

        try {
            await feedbackApi.create({ description: description.trim() });
            toast.success('Your feedback has been submitted successfully. Our team will review it shortly.');
            setDescription('');
            onClose();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to submit feedback. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div
                    className="relative w-full max-w-lg transform rounded-2xl bg-white shadow-2xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Send Feedback
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Help us improve your experience
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="px-6 py-5">
                        <div className="mb-4">
                            <label
                                htmlFor="feedback-description"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Your Feedback
                            </label>
                            <textarea
                                ref={textareaRef}
                                id="feedback-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell us about a bug, suggest a feature, or share your thoughts..."
                                rows={6}
                                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                disabled={isSubmitting}
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Minimum 10 characters required
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 mb-5">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                What can you share?
                            </h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>Bug reports and issues</li>
                                <li>Feature requests and suggestions</li>
                                <li>Usability improvements</li>
                                <li>General comments and ideas</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !description.trim()}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
