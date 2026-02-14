import React from 'react';
import { GeneratedCV } from '@/types';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

interface CVPreviewProps {
    cv: GeneratedCV;
    onUpdateSummary?: (newSummary: string) => Promise<void>;
}

export default function CVPreview({ cv, onUpdateSummary }: CVPreviewProps) {
    const [isEditingSummary, setIsEditingSummary] = React.useState(false);
    const [editedSummary, setEditedSummary] = React.useState('');

    if (!cv.generatedContent) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                <p>No generated content available.</p>
            </div>
        );
    }

    React.useEffect(() => {
        if (cv.generatedContent?.professionalSummary) {
            setEditedSummary(cv.generatedContent.professionalSummary);
        }
    }, [cv.generatedContent?.professionalSummary]);

    const handleSaveClick = async () => {
        if (onUpdateSummary) {
            await onUpdateSummary(editedSummary);
            setIsEditingSummary(false);
        }
    };

    const templateName = cv.templateName?.toLowerCase() || 'modern';

    const commonProps = {
        cv,
        onUpdateSummary,
        isEditingSummary,
        editedSummary,
        setEditedSummary,
        setIsEditingSummary,
        handleSaveClick
    };

    switch (templateName) {
        case 'classic':
            return <ClassicTemplate {...commonProps} />;
        case 'professional':
            return <ProfessionalTemplate {...commonProps} />;
        case 'creative':
            return <CreativeTemplate {...commonProps} />;
        case 'executive':
            return <ExecutiveTemplate {...commonProps} />;
        case 'minimal':
            return <MinimalTemplate {...commonProps} />;
        case 'modern':
        default:
            return <ModernTemplate {...commonProps} />;
    }
}
