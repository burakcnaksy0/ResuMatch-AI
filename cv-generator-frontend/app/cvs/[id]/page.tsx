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
            const toastId = toast.loading('PDF yüksek kalitede hazırlanıyor...');
            console.log('Starting PDF generation with clone strategy...');

            // Dynamically import libraries
            let toPng, jsPDF;
            try {
                const htmlToImage = await import('html-to-image');
                toPng = htmlToImage.toPng;
                const jspdfModule = await import('jspdf');
                jsPDF = jspdfModule.default;
            } catch (impErr) {
                console.error('Library import failed:', impErr);
                toast.dismiss(toastId);
                toast.error('Gerekli kütüphaneler yüklenemedi.');
                return;
            }

            const sourceElement = document.getElementById('cv-preview');
            if (!sourceElement) {
                toast.dismiss(toastId);
                toast.error('CV görüntülenemedi.');
                return;
            }

            // 1. CLONE STRATEGY: Create an isolated container for the clone
            // This ensures we capture the CV at its "ideal" print size (A4 width)
            // regardless of the user's current screen width or zoom level.
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            container.style.width = '210mm'; // Standard A4 Width
            // Ensure no interfering styles from parent
            container.style.zIndex = '-1';

            // Clone the node
            const clone = sourceElement.cloneNode(true) as HTMLElement;

            // Force the clone to have the exact width for A4
            clone.style.width = '100%';
            clone.style.height = 'auto';
            clone.style.margin = '0';
            clone.style.transform = 'none';
            clone.style.boxShadow = 'none';

            // Append clone to container, and container to body
            container.appendChild(clone);
            document.body.appendChild(container);

            // 2. WAIT FOR ASSETS
            // Wait slightly for the DOM to settle and images/fonts in the clone to ready
            const images = clone.getElementsByTagName('img');
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));

            // Allow a small tick for layout calculation
            await new Promise(resolve => setTimeout(resolve, 500));

            // 3. CAPTURE
            const pixelRatio = 3; // Higher quality for sharper text
            let imgData;

            try {
                imgData = await toPng(clone, {
                    quality: 1.0,
                    pixelRatio: pixelRatio,
                    backgroundColor: '#ffffff',
                    cacheBust: true,
                    style: {
                        // Ensure no transforms interfere during capture
                        transform: 'none',
                        margin: '0',
                    },
                });
            } catch (captureError: any) {
                console.error('Clone snapshot failed:', captureError);
                // Clean up
                document.body.removeChild(container);

                toast.dismiss(toastId);
                const errMsg = captureError?.message || 'Bilinmeyen hata';
                toast.error(`PDF oluşturulurken hata: ${errMsg}`);
                return;
            }

            // 4. GENERATE PDF
            // Use the dimensions of the CLONED element
            const pdfWidth = clone.offsetWidth;
            const pdfHeight = clone.offsetHeight;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [pdfWidth * pixelRatio, pdfHeight * pixelRatio] // Match canvas pixels
            });

            const pdfPageWidth = pdf.internal.pageSize.getWidth();
            const pdfPageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfPageWidth, pdfPageHeight);

            // 5. ADD LINKS (using coordinates from the CLONE)
            const links = clone.querySelectorAll('a');
            const cloneRect = clone.getBoundingClientRect();

            links.forEach((link) => {
                const rect = link.getBoundingClientRect();

                // Calculate position relative to the clone container
                const relativeX = (rect.left - cloneRect.left) * pixelRatio;
                const relativeY = (rect.top - cloneRect.top) * pixelRatio;
                const linkWidth = rect.width * pixelRatio;
                const linkHeight = rect.height * pixelRatio;

                const href = link.getAttribute('href');
                if (href) {
                    pdf.link(relativeX, relativeY, linkWidth, linkHeight, { url: href });
                }
            });

            // 6. SAVE & CLEANUP
            const safeName = (cv.profile?.fullName || 'cv').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            pdf.save(`${safeName}.pdf`);

            // Clean up the DOM
            document.body.removeChild(container);

            toast.dismiss(toastId);
            toast.success('CV başarıyla indirildi');

        } catch (error: any) {
            console.error('PDF Generation Pipeline Error:', error);
            toast.dismiss();
            toast.error(`Beklenmeyen hata: ${error?.message}`);
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
