import React from 'react';
import { GeneratedCV } from '@/types';

interface TemplateProps {
    cv: GeneratedCV;
    onUpdateSummary?: (newSummary: string) => Promise<void>;
    isEditingSummary: boolean;
    editedSummary: string;
    setEditedSummary: (val: string) => void;
    setIsEditingSummary: (val: boolean) => void;
    handleSaveClick: () => void;
}

export default function ExecutiveTemplate({
    cv,
    onUpdateSummary,
    isEditingSummary,
    editedSummary,
    setEditedSummary,
    setIsEditingSummary,
    handleSaveClick
}: TemplateProps) {
    const { profile, generatedContent: content } = cv;
    if (!content) return null;

    return (
        <div id="cv-preview" className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-white shadow-lg py-12 px-16 font-serif border-t-8 border-slate-900">
            {/* Header */}
            <div className="text-center mb-12 border-b-2 border-slate-200 pb-8">
                <h1 className="text-4xl font-black uppercase tracking-widest text-slate-900 mb-2 font-sans">{profile?.fullName}</h1>
                <p className="text-lg uppercase tracking-wide text-slate-500 font-bold mb-4 font-sans">{cv.jobPosting?.jobTitle}</p>

                <div className="flex justify-center items-center gap-6 text-sm font-medium text-slate-600 font-sans">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {profile?.email}
                    </span>
                    {profile?.phone && (
                        <span className="flex items-center gap-2 border-l border-slate-300 pl-6">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {profile.phone}
                        </span>
                    )}
                    {profile?.location && (
                        <span className="flex items-center gap-2 border-l border-slate-300 pl-6">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {profile.location}
                        </span>
                    )}
                </div>
            </div>

            {/* Executive Summary */}
            <div className="mb-10">
                <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4 font-sans">Executive Summary</h2>
                {isEditingSummary ? (
                    <div className="space-y-4">
                        <textarea
                            value={editedSummary}
                            onChange={(e) => setEditedSummary(e.target.value)}
                            className="w-full p-4 border-2 border-slate-200 rounded font-serif text-lg leading-relaxed text-slate-700 focus:border-slate-900 focus:ring-0"
                            rows={6}
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsEditingSummary(false)} className="text-xs uppercase bg-white border border-slate-300 px-4 py-2 font-bold text-slate-500 rounded hover:bg-slate-50">Cancel</button>
                            <button onClick={handleSaveClick} className="text-xs uppercase bg-slate-900 px-4 py-2 font-bold text-white rounded hover:bg-slate-800 shadow-lg">Update Narrative</button>
                        </div>
                    </div>
                ) : (
                    <div className="relative group">
                        <p className="text-lg leading-relaxed text-slate-800 text-justify font-serif italic border-l-4 border-slate-200 pl-6">
                            "{content.professionalSummary}"
                        </p>
                        {onUpdateSummary && (
                            <button
                                onClick={() => setIsEditingSummary(true)}
                                className="absolute -top-8 right-0 text-xs font-bold uppercase text-slate-300 hover:text-slate-900 font-sans tracking-widest"
                            >
                                Edit Focus
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Core Competencies (Grid) */}
            <div className="mb-12 bg-slate-50 p-8 border border-slate-100 rounded-sm">
                <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6 font-sans text-center">Core Competencies</h2>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-sans text-sm font-bold text-slate-700 uppercase tracking-wide">
                    {content.skills && content.skills.map((skill: any, idx: number) => (
                        <span key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Experience */}
            <div className="mb-12">
                <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-8 font-sans border-b border-slate-200 pb-2">Professional Experience</h2>
                <div className="space-y-10">
                    {content.workExperience.map((exp, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between items-baseline mb-2 font-sans">
                                <h3 className="text-xl font-black text-slate-900 uppercase">{exp.position}</h3>
                                <span className="text-sm font-bold text-slate-400">{exp.startDate} – {exp.endDate || 'Present'}</span>
                            </div>
                            <h4 className="text-base font-bold text-slate-600 mb-4 font-sans uppercase tracking-wide">{exp.company}</h4>
                            <p className="text-base text-slate-700 leading-relaxed text-justify mb-4">
                                {exp.description}
                            </p>
                            {exp.achievements && (
                                <ul className="space-y-2 mt-4">
                                    {exp.achievements.map((ach, i) => (
                                        <li key={i} className="flex items-start gap-4 text-sm text-slate-600">
                                            <span className="mt-2 w-1.5 h-1.5 bg-slate-300 shrink-0"></span>
                                            <span className="leading-relaxed">{ach}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Education & Projects (2 Col) */}
            <div className="flex gap-16 font-sans pt-8 border-t border-slate-200">
                <div className="w-1/2">
                    <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">Education</h2>
                    <div className="space-y-6">
                        {content.education.map((edu, idx) => (
                            <div key={idx}>
                                <h3 className="font-bold text-slate-800">{edu.institution}</h3>
                                <p className="text-sm text-slate-500 mb-1">{edu.degree}</p>
                                <p className="text-xs text-slate-400 font-medium uppercase">{edu.startDate} – {edu.endDate || 'Present'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {content.projects && content.projects.length > 0 && (
                    <div className="w-1/2">
                        <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">Key Initiatives</h2>
                        <div className="space-y-6">
                            {content.projects.map((proj, idx) => (
                                <div key={idx}>
                                    <h3 className="font-bold text-slate-800">{proj.name}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-1 line-clamp-2">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
