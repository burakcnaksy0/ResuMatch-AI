'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generatedCVApi, CVTemplate } from '@/lib/api/client';
import { useSubscription } from '@/contexts/SubscriptionContext';
import toast from 'react-hot-toast';
import { Crown, Check, Layout, Info } from 'lucide-react';

interface GenerateCvModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (options: GenerateOptions) => void;
    profilePictureUrl?: string | null;
    isGenerating: boolean;
}

export interface GenerateOptions {
    includeProfilePicture: boolean;
    cvSpecificPhotoUrl?: string;
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
    const router = useRouter();
    const { subscription } = useSubscription();
    const [step, setStep] = useState<'template' | 'customize'>('template');
    const [photoOption, setPhotoOption] = useState<'none' | 'profile' | 'upload'>('none');
    const [tone, setTone] = useState('Professional');
    const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
    const [templates, setTemplates] = useState<CVTemplate[]>([]);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isPro = subscription?.subscriptionType === 'PRO' && subscription?.isActive;

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await generatedCVApi.getTemplates();
                if (res.data?.templates && Array.isArray(res.data.templates)) {
                    setTemplates(res.data.templates);
                    // Set default template to first free template
                    const defaultTemplate = res.data.templates.find((t: CVTemplate) => !t.isPro) || res.data.templates[0];
                    setSelectedTemplate(defaultTemplate);
                }
            } catch (err) {
                console.error('Failed to fetch templates', err);
            }
        };
        if (isOpen) {
            fetchTemplates();
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleTemplateSelect = (template: CVTemplate) => {
        if (template.isPro && !isPro) {
            toast.error(
                <div className="flex flex-col gap-1">
                    <p className="font-semibold">Bu template Pro üyeler için!</p>
                    <p className="text-sm">Pro'ya yükselterek tüm template'lere erişin.</p>
                </div>,
                {
                    duration: 4000,
                    icon: '👑',
                }
            );
            router.push('/pricing');
            return;
        }
        setSelectedTemplate(template);
    };

    const handleGenerateClick = async () => {
        if (!selectedTemplate) {
            toast.error('Lütfen bir template seçin');
            return;
        }

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
            includeProfilePicture: photoOption === 'profile' || photoOption === 'upload',
            cvSpecificPhotoUrl,
            tone,
            templateName: selectedTemplate.id,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
            <div className="bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#3b82f6] to-[#6366f1] p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors text-2xl"
                    >
                        ✕
                    </button>
                    <h2 className="text-2xl font-bold text-white">CV Oluştur</h2>
                    <p className="text-blue-100 mt-1">Template seç ve CV'ni özelleştir</p>

                    {/* Step indicator */}
                    <div className="flex items-center gap-4 mt-4">
                        <div className={`flex items-center gap-2 ${step === 'template' ? 'text-white' : 'text-blue-200'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'template' ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'}`}>
                                1
                            </div>
                            <span className="font-semibold">Template Seç</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-blue-300"></div>
                        <div className={`flex items-center gap-2 ${step === 'customize' ? 'text-white' : 'text-blue-200'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'customize' ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'}`}>
                                2
                            </div>
                            <span className="font-semibold">Özelleştir</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
                    {step === 'template' ? (
                        // Template Selection Step
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {templates.map((template) => {
                                    const isSelected = selectedTemplate?.id === template.id;
                                    const canAccess = !template.isPro || isPro;

                                    return (
                                        <button
                                            key={template.id}
                                            onClick={() => handleTemplateSelect(template)}
                                            className={`relative group text-left p-4 rounded-xl border-2 transition-all ${isSelected
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : canAccess
                                                    ? 'border-gray-600 hover:border-blue-400 bg-[#232a36]'
                                                    : 'border-gray-700 bg-gray-800/50 opacity-75'
                                                }`}
                                        >
                                            {/* Pro Badge */}
                                            {template.isPro && (
                                                <div className="absolute top-3 right-3 z-10">
                                                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
                                                        <Crown className="w-3 h-3" />
                                                        PRO
                                                    </div>
                                                </div>
                                            )}

                                            {/* Selected indicator */}
                                            {isSelected && (
                                                <div className="absolute top-3 left-3 z-10">
                                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Template Preview */}
                                            <div className="aspect-[3/4] bg-white rounded-lg mb-3 overflow-hidden relative shadow-sm border border-gray-700/50">
                                                {/* Visual Mockups based on template type */}
                                                {template.id === 'modern' ? (
                                                    // Modern: Sidebar Left, Content Right
                                                    <div className="w-full h-full flex">
                                                        <div className="w-1/3 bg-slate-800 h-full p-2 flex flex-col gap-2">
                                                            <div className="w-12 h-12 bg-slate-600 rounded-full mx-auto mb-1"></div>
                                                            <div className="h-1.5 w-full bg-slate-600 rounded"></div>
                                                            <div className="h-1.5 w-3/4 bg-slate-600 rounded"></div>
                                                            <div className="h-1.5 w-full bg-slate-600 rounded mt-2"></div>
                                                            <div className="h-1.5 w-full bg-slate-600 rounded"></div>
                                                        </div>
                                                        <div className="w-2/3 p-2 flex flex-col gap-2">
                                                            <div className="h-4 w-3/4 bg-slate-900 rounded mb-2"></div>
                                                            <div className="h-2 w-full bg-slate-200 rounded"></div>
                                                            <div className="h-2 w-full bg-slate-200 rounded"></div>
                                                            <div className="h-16 w-full bg-slate-100 rounded mt-1 border border-slate-200"></div>
                                                            <div className="h-16 w-full bg-slate-100 rounded mt-1 border border-slate-200"></div>
                                                        </div>
                                                    </div>
                                                ) : template.id === 'classic' ? (
                                                    // Classic: Simple Top-Down
                                                    <div className="w-full h-full p-3 flex flex-col gap-2 bg-white">
                                                        <div className="text-center mb-2">
                                                            <div className="h-3 w-1/2 bg-slate-900 mx-auto rounded mb-1"></div>
                                                            <div className="h-1.5 w-1/3 bg-slate-400 mx-auto rounded"></div>
                                                        </div>
                                                        <div className="h-px w-full bg-slate-300 my-1"></div>
                                                        <div className="h-2 w-1/4 bg-slate-800 rounded mt-1"></div>
                                                        <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                                                        <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                                                        <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                                                        <div className="h-2 w-1/4 bg-slate-800 rounded mt-2"></div>
                                                        <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                                                        <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                                                    </div>
                                                ) : template.id === 'professional' ? (
                                                    // Professional: Header Bar, Clean Body
                                                    <div className="w-full h-full flex flex-col bg-white">
                                                        <div className="w-full h-1/5 bg-slate-900 p-2 flex items-end">
                                                            <div className="h-3 w-1/2 bg-white/90 rounded"></div>
                                                        </div>
                                                        <div className="p-2 flex gap-2 h-full">
                                                            <div className="w-2/3 flex flex-col gap-1.5">
                                                                <div className="h-2 w-1/3 bg-slate-800 rounded mt-1"></div>
                                                                <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                                                                <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                                                                <div className="h-2 w-1/3 bg-slate-800 rounded mt-2"></div>
                                                                <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                                                            </div>
                                                            <div className="w-1/3 flex flex-col gap-1.5 pt-1">
                                                                <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                                                                <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                                                                <div className="h-1.5 w-3/4 bg-slate-300 rounded"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : template.id === 'creative' ? (
                                                    // Creative: Bold Header, Grid
                                                    <div className="w-full h-full flex flex-col bg-slate-50">
                                                        <div className="w-full p-3 bg-indigo-600">
                                                            <div className="h-4 w-1/2 bg-white rounded"></div>
                                                        </div>
                                                        <div className="p-2 grid grid-cols-2 gap-2 h-full">
                                                            <div className="bg-white p-1 rounded border border-slate-200">
                                                                <div className="h-2 w-1/2 bg-indigo-900/50 rounded mb-1"></div>
                                                                <div className="h-1 w-full bg-slate-200 rounded"></div>
                                                            </div>
                                                            <div className="bg-white p-1 rounded border border-slate-200">
                                                                <div className="h-2 w-1/2 bg-indigo-900/50 rounded mb-1"></div>
                                                                <div className="h-1 w-full bg-slate-200 rounded"></div>
                                                            </div>
                                                            <div className="col-span-2 bg-white p-1 rounded border border-slate-200 flex-1">
                                                                <div className="h-2 w-1/4 bg-indigo-900/50 rounded mb-1"></div>
                                                                <div className="h-1 w-full bg-slate-200 rounded mb-1"></div>
                                                                <div className="h-1 w-full bg-slate-200 rounded"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : template.id === 'minimal' ? (
                                                    // Minimal: Lots of whitespace, centered
                                                    <div className="w-full h-full p-4 flex flex-col gap-3 bg-white">
                                                        <div className="text-right">
                                                            <div className="h-4 w-1/2 bg-black ml-auto rounded"></div>
                                                        </div>
                                                        <div className="flex-1 border-t-2 border-black pt-2 flex flex-col gap-2">
                                                            <div className="h-2 w-1/6 bg-gray-400 rounded"></div>
                                                            <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                                                            <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                                                            <div className="h-2 w-1/6 bg-gray-400 rounded mt-2"></div>
                                                            <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Default / Executive
                                                    <div className="w-full h-full p-2 flex flex-col bg-amber-50/50">
                                                        <div className="border-b-2 border-slate-800 pb-2 mb-2">
                                                            <div className="h-4 w-2/3 bg-slate-900 rounded"></div>
                                                        </div>
                                                        <div className="flex gap-2 flex-1">
                                                            <div className="w-2/3 flex flex-col gap-2">
                                                                <div className="h-2 w-1/3 bg-slate-700 rounded"></div>
                                                                <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                                                                <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                                                                <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                                                            </div>
                                                            <div className="w-1/3 border-l border-slate-300 pl-2 flex flex-col gap-2">
                                                                <div className="h-2 w-full bg-slate-700 rounded"></div>
                                                                <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                                                                <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {!canAccess && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
                                                        <Crown className="w-10 h-10 text-amber-500 mb-2 drop-shadow-lg" />
                                                        <span className="text-white font-bold text-sm tracking-wider uppercase">Premium</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Template Info */}
                                            <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                                            <p className="text-xs text-blue-200 mb-2">{template.category}</p>
                                            <p className="text-sm text-gray-300 mb-3 line-clamp-2">{template.description}</p>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {template.features.slice(0, 2).map((feature, idx) => (
                                                    <span key={idx} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Best For */}
                                            <div className="text-xs text-gray-400">
                                                <span className="font-semibold">Best for:</span> {template.bestFor.slice(0, 2).join(', ')}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Info banner */}
                            {!isPro && (
                                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-blue-200">
                                                <span className="font-semibold">Free plandasınız.</span> Seçili ücretsiz şablonu kullanabilirsiniz. Premium şablonlar için Pro'ya geçebilirsiniz.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Customization Step
                        <div className="space-y-6">
                            {/* Selected Template Display */}
                            {selectedTemplate && (
                                <div className="p-4 bg-[#232a36] rounded-xl border border-gray-600">
                                    <div className="flex items-center gap-3">
                                        <Layout className="w-10 h-10 text-blue-400" />
                                        <div>
                                            <h3 className="font-bold text-white">{selectedTemplate.name}</h3>
                                            <p className="text-sm text-gray-400">{selectedTemplate.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tone Selection */}
                            <div>
                                <label className="block text-sm font-bold text-white mb-2">
                                    Professional Summary Tone
                                </label>
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="w-full border border-gray-600 bg-[#232a36] text-white font-medium rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Professional">Professional (Standard)</option>
                                    <option value="Technical">Technical (Focus on skills/stack)</option>
                                    <option value="Leadership">Leadership (Focus on management/impact)</option>
                                    <option value="Creative">Creative (More expressive)</option>
                                    <option value="Entry-Level">Entry-Level (Focus on potential/education)</option>
                                    <option value="Academic">Academic (Detailed & Formal)</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    This tone will be used to rewrite your summary and experience descriptions.
                                </p>
                            </div>

                            {/* Photo Selection */}
                            <div>
                                <label className="block text-sm font-bold text-white mb-2">
                                    CV Photo
                                </label>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${photoOption === 'none' ? 'bg-blue-500/20 border-blue-500' : 'border-gray-600 hover:bg-[#232a36]'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="photoOption"
                                            value="none"
                                            checked={photoOption === 'none'}
                                            onChange={() => setPhotoOption('none')}
                                            className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                                        />
                                        <span className="text-white font-medium">No Photo</span>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${photoOption === 'profile' ? 'bg-blue-500/20 border-blue-500' : 'border-gray-600 hover:bg-[#232a36]'
                                        }`}>
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
                                            <span className={`font-medium ${!profilePictureUrl ? 'text-gray-500' : 'text-white'}`}>
                                                Use Profile Photo
                                            </span>
                                            {profilePictureUrl && (
                                                <img
                                                    src={profilePictureUrl}
                                                    alt="Profile"
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-500"
                                                />
                                            )}
                                            {!profilePictureUrl && (
                                                <span className="text-xs text-red-400 ml-auto">(Not set)</span>
                                            )}
                                        </div>
                                    </label>

                                    <label className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-colors ${photoOption === 'upload' ? 'bg-blue-500/20 border-blue-500' : 'border-gray-600 hover:bg-[#232a36]'
                                        }`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <input
                                                type="radio"
                                                name="photoOption"
                                                value="upload"
                                                checked={photoOption === 'upload'}
                                                onChange={() => setPhotoOption('upload')}
                                                className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                                            />
                                            <span className="text-white font-medium">Upload Specific Photo</span>
                                        </div>
                                        {photoOption === 'upload' && (
                                            <div className="ml-7 mt-1">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    accept="image/png, image/jpeg"
                                                    className="block w-full text-sm text-gray-300
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-bold
                                                        file:bg-blue-600 file:text-white
                                                        hover:file:bg-blue-700
                                                        cursor-pointer"
                                                />
                                                {previewUrl && (
                                                    <div className="mt-3">
                                                        <p className="text-xs font-semibold text-gray-300 mb-1">Preview:</p>
                                                        <img
                                                            src={previewUrl}
                                                            alt="Preview"
                                                            className="w-16 h-16 object-cover rounded-lg border border-gray-500"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-[#232a36] p-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                        {step === 'customize' ? (
                            <button
                                onClick={() => setStep('template')}
                                className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
                                disabled={isGenerating || isUploading}
                            >
                                ← Geri
                            </button>
                        ) : (
                            <div></div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600"
                                disabled={isGenerating || isUploading}
                            >
                                İptal
                            </button>
                            {step === 'template' ? (
                                <button
                                    onClick={() => setStep('customize')}
                                    disabled={!selectedTemplate}
                                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Devam Et →
                                </button>
                            ) : (
                                <button
                                    onClick={handleGenerateClick}
                                    disabled={isGenerating || isUploading || !selectedTemplate}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                                >
                                    {isUploading ? 'Uploading Photo...' : isGenerating ? 'Generating CV...' : '✨ Generate CV'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
