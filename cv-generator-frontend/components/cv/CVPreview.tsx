import React from 'react';
import { GeneratedCV, GeneratedCvContent } from '@/types';
import { BuildingStorefrontIcon, AcademicCapIcon, WrenchScrewdriverIcon, UserIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

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

    const content = cv.generatedContent;
    const { profile } = cv;

    // Determine photo URL
    const photoUrl = cv.cvSpecificPhotoUrl || (cv.includeProfilePicture ? profile?.profilePictureUrl : null);

    const handleEditClick = () => {
        setEditedSummary(content.professionalSummary || '');
        setIsEditingSummary(true);
    };

    const handleSaveClick = async () => {
        if (onUpdateSummary) {
            await onUpdateSummary(editedSummary);
            setIsEditingSummary(false);
        }
    };

    const titles = content.sectionTitles || {
        professionalSummary: 'Professional Summary',
        workExperience: 'Work Experience',
        education: 'Education',
        skills: 'Technical Skills',
        projects: 'Projects',
        certifications: 'Certifications',
        languages: 'Languages'
    };

    return (
        <div id="cv-preview" className="max-w-[21cm] mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none">
            {/* Header */}
            <div className="bg-slate-900 text-white p-8">
                <div className="flex justify-between items-start">
                    <div className="flex gap-6 items-center">
                        {photoUrl && (
                            <img
                                src={photoUrl}
                                alt={profile?.fullName || 'Profile'}
                                crossOrigin="anonymous"
                                className="w-24 h-24 rounded-full object-cover border-4 border-slate-700 shadow-md"
                            />
                        )}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{profile?.fullName || 'Candidate Name'}</h1>
                            <div className="text-slate-300 space-y-1 text-sm">
                                {/* We could add contact info here if passed in profile or generated content */}
                                <p>{cv.jobPosting?.jobTitle} Application for {cv.jobPosting?.company}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                        Generated on {new Date(cv.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Professional Summary */}
                <section>
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-blue-600" /> {titles.professionalSummary}
                        </h2>
                        {onUpdateSummary && !isEditingSummary && (
                            <button
                                onClick={handleEditClick}
                                className="text-sm text-blue-600 hover:text-blue-800 print:hidden"
                                data-html2canvas-ignore
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {isEditingSummary ? (
                        <div className="space-y-3">
                            <textarea
                                value={editedSummary}
                                onChange={(e) => setEditedSummary(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsEditingSummary(false)}
                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveClick}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">{content.professionalSummary}</p>
                    )}
                </section>

                {/* Work Experience */}
                <section>
                    <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                        <BuildingStorefrontIcon className="w-5 h-5 text-blue-600" /> {titles.workExperience}
                    </h2>
                    <div className="space-y-6">
                        {content.workExperience.map((exp, index) => (
                            <div key={index} className="relative pl-4 border-l-2 border-slate-200">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200"></div>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                        {exp.startDate} - {exp.endDate || 'Present'}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-600 mb-2 flex items-center gap-4">
                                    <span className="font-medium">{exp.company}</span>
                                    {exp.location && (
                                        <span className="flex items-center gap-1 text-slate-400 text-xs">
                                            <MapPinIcon className="w-3 h-3" /> {exp.location}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-700 mb-2">{exp.description}</p>
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-600">
                                        {exp.achievements.map((ach, i) => (
                                            <li key={i}>{ach}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                        <WrenchScrewdriverIcon className="w-5 h-5 text-blue-600" /> {titles.skills}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.skills.reduce((acc: any[], skill) => {
                            const category = skill.category || 'Other';
                            const existingCategory = acc.find(c => c.category === category);
                            if (existingCategory) {
                                existingCategory.skills.push(skill);
                            } else {
                                acc.push({ category, skills: [skill] });
                            }
                            return acc;
                        }, []).map((group: any, index: number) => (
                            <div key={index}>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">{group.category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {group.skills.map((skill: any, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200">
                                            {skill.name} <span className="text-slate-400 mx-1">|</span> {skill.proficiencyLevel}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                        <AcademicCapIcon className="w-5 h-5 text-blue-600" /> {titles.education}
                    </h2>
                    <div className="space-y-4">
                        {content.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{edu.institution}</h3>
                                    <p className="text-sm text-slate-600">{edu.degree} in {edu.fieldOfStudy}</p>
                                    {edu.description && <p className="text-sm text-slate-500 mt-1">{edu.description}</p>}
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded block mb-1">
                                        {edu.startDate} - {edu.endDate || 'Present'}
                                    </span>
                                    {edu.gpa && <span className="text-xs text-slate-400">GPA: {edu.gpa}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects */}
                {content.projects && content.projects.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-4">{titles.projects}</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {content.projects.map((proj, index) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-slate-900">
                                            {proj.url ? (
                                                <a href={proj.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                                                    {proj.name}
                                                </a>
                                            ) : proj.name}
                                        </h3>
                                        {proj.githubUrl && (
                                            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-gray-900 flex items-center gap-1">
                                                GitHub ↗
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-700 mb-2">{proj.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {proj.technologies.map((tech, i) => (
                                            <span key={i} className="text-[10px] uppercase tracking-wider font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
