'use client';

import { useState, useEffect } from 'react';
import { generatedCVApi } from '@/lib/api/client';
import { GeneratedCV } from '@/types';
import CVPreview from '@/components/cv/CVPreview';
import Link from 'next/link';
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';

export default function CVDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [cv, setCv] = useState<GeneratedCV | null>(null);
    const [loading, setLoading] = useState(true);
    const userId = 'user-123'; // TODO: Get from auth

    useEffect(() => {
        if (params.id) {
            fetchCV(params.id as string);
        }
    }, [params.id]);

    const fetchCV = async (id: string) => {
        try {
            const response = await generatedCVApi.getById(id, userId);
            setCv(response.data);
        } catch (error) {
            console.error('Failed to fetch CV', error);
            toast.error('Failed to load CV details');
            router.push('/cvs');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!cv) return;

        try {
            const toastId = toast.loading('PDF hazırlanıyor...');
            console.log('Starting PDF generation with html-to-image...');

            // Dynamically import libraries
            let toPng, jsPDF;
            try {
                const htmlToImage = await import('html-to-image');
                toPng = htmlToImage.toPng;
                const jspdfModule = await import('jspdf');
                jsPDF = jspdfModule.default;
            } catch (impErr) {
                console.error('Library import failed:', impErr);
                throw new Error('Failed to load PDF libraries');
            }

            const element = document.getElementById('cv-preview');
            if (!element) {
                toast.dismiss(toastId);
                toast.error('Preview content not found');
                return;
            }

            console.log('Element found, capturing...');

            // Capture the element using html-to-image
            let imgData;
            try {
                // First attempt: capture everything with high quality
                imgData = await toPng(element, {
                    quality: 1.0,
                    pixelRatio: 2,
                    backgroundColor: '#ffffff',
                    // cacheBust: true, // Removed as it can cause CORS issues with some CDNs
                    skipOnError: true,
                    width: element.scrollWidth,
                    height: element.scrollHeight,
                    style: {
                        transform: 'none',
                        margin: '0',
                        border: 'none',
                        borderRadius: '0',
                        boxShadow: 'none'
                    },
                    filter: (node: any) => {
                        if (node instanceof HTMLElement && (
                            node.hasAttribute('data-html2canvas-ignore') ||
                            node.tagName === 'SCRIPT'
                        )) {
                            return false;
                        }
                        return true;
                    }
                } as any);
            } catch (firstError) {
                console.warn('First attempt failed, retrying without images...', firstError);
                // Second attempt: filter out images if they are causing issues
                imgData = await toPng(element, {
                    quality: 1.0,
                    pixelRatio: 2,
                    backgroundColor: '#ffffff',
                    skipOnError: true,
                    width: element.scrollWidth,
                    height: element.scrollHeight,
                    style: {
                        transform: 'none',
                        margin: '0',
                        border: 'none',
                        borderRadius: '0',
                        boxShadow: 'none'
                    },
                    filter: (node: any) => {
                        if (node instanceof HTMLElement && (
                            node.hasAttribute('data-html2canvas-ignore') ||
                            node.tagName === 'SCRIPT' ||
                            node.tagName === 'IMG' // Exclude images on retry
                        )) {
                            return false;
                        }
                        return true;
                    }
                } as any);
                toast.error('Bazı resimler yüklenemediği için PDF resimsiz oluşturuldu.');
            }

            console.log('Capture successful, creating PDF...');

            // Initialize PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [element.offsetWidth * 2, element.offsetHeight * 2] // Match the canvas size (pixelRatio 2)
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Add image to PDF filling the page
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            pdf.save(`cv-${cv.profile?.fullName || 'generated'}.pdf`);

            toast.dismiss(toastId);
            toast.success('PDF İndirildi');
        } catch (error: any) {
            console.error('Failed to generate PDF Full Error:', error);
            if (error && typeof error === 'object') {
                try {
                    console.error('Error Details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
                } catch (e) {
                    console.error('Could not stringify error object');
                }
            }

            toast.dismiss();
            toast.error(`PDF oluşturulamadı: ${error?.message || 'Bilinmeyen hata'}`);
        }
    };

    const handleUpdateSummary = async (newSummary: string) => {
        if (!cv) return;
        try {
            const toastId = toast.loading('Updating summary...');
            await generatedCVApi.update(cv.id, {
                professionalSummary: newSummary
            });

            // Update local state
            const updatedCv = { ...cv };
            if (updatedCv.generatedContent) {
                updatedCv.generatedContent = {
                    ...updatedCv.generatedContent,
                    professionalSummary: newSummary
                };
            }
            setCv(updatedCv);

            toast.dismiss(toastId);
            toast.success('Summary updated');
        } catch (error) {
            console.error('Failed to update summary', error);
            toast.error('Failed to update summary');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!cv) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toolbar - No Print */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 print:hidden">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/cvs" className="flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium">
                        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to CVs
                    </Link>

                    <div className="flex gap-3">
                        <button
                            onClick={handleDownloadPdf}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 text-sm font-medium transition"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 print:p-0 print:max-w-none">
                <CVPreview cv={cv} onUpdateSummary={handleUpdateSummary} />
            </div>
        </div>
    );
}
