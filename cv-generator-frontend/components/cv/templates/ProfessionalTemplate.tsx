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

export default function ProfessionalTemplate({
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
        <div id="cv-preview" className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-white shadow-lg font-sans">
            {/* Header */}
            <header className="bg-slate-900 text-white p-12 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold uppercase tracking-wide mb-2">{profile?.fullName}</h1>
                    <p className="text-xl font-light text-slate-300 uppercase tracking-widest">{cv.jobPosting?.jobTitle}</p>
                </div>
                <div className="text-right text-sm font-light text-slate-300 space-y-1">
                    <p>{profile?.email}</p>
                    <p>{profile?.phone}</p>
                    <p>{profile?.location}</p>
                </div>
            </header>

            <div className="flex flex-row p-12 gap-12">
                {/* Main Column */}
                <div className="w-[65%] space-y-10">
                    {/* Summary */}
                    <section>
                        <h2 className="text-lg font-bold uppercase text-slate-800 border-b-2 border-slate-900 pb-2 mb-4">
                            Professional Profile
                        </h2>
                        {isEditingSummary ? (
                            <div className="space-y-4">
                                <textarea
                                    value={editedSummary}
                                    onChange={(e) => setEditedSummary(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded font-light leading-relaxed text-sm"
                                    rows={6}
                                />
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setIsEditingSummary(false)} className="text-xs uppercase bg-gray-100 px-4 py-2 font-bold text-gray-600 rounded">Cancel</button>
                                    <button onClick={handleSaveClick} className="text-xs uppercase bg-slate-900 px-4 py-2 font-bold text-white rounded hover:bg-slate-700">Save Profile</button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group">
                                <p className="text-sm font-light leading-7 text-slate-700 text-justify">
                                    {content.professionalSummary}
                                </p>
                                {onUpdateSummary && (
                                    <button
                                        onClick={() => setIsEditingSummary(true)}
                                        className="absolute -top-8 right-0 text-xs font-bold uppercase text-slate-400 hover:text-slate-900"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Experience */}
                    <section>
                        <h2 className="text-lg font-bold uppercase text-slate-800 border-b-2 border-slate-900 pb-2 mb-6">
                            Work Experience
                        </h2>
                        <div className="space-y-8">
                            {content.workExperience.map((exp, idx) => (
                                <div key={idx} className="relative pl-6 border-l-2 border-slate-200">
                                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-white box-content"></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-900 text-base">{exp.position}</h3>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-600 mb-3">{exp.company}</h4>
                                    <p className="text-sm font-light text-slate-600 leading-relaxed mb-3">
                                        {exp.description}
                                    </p>
                                    {exp.achievements && (
                                        <ul className="list-disc ml-4 space-y-1">
                                            {exp.achievements.map((ach, i) => (
                                                <li key={i} className="text-xs text-slate-500">{ach}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects */}
                    {content.projects && content.projects.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase text-slate-800 border-b-2 border-slate-900 pb-2 mb-6">
                                Projects
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {content.projects.map((proj, idx) => (
                                    <div key={idx} className="bg-slate-50 p-4 border border-slate-100 rounded">
                                        <h3 className="font-bold text-slate-900 text-sm mb-1">{proj.name}</h3>
                                        <p className="text-xs font-light text-slate-600 leading-relaxed mb-2 line-clamp-3">
                                            {proj.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {proj.technologies.slice(0, 3).map((tech, tIdx) => (
                                                <span key={tIdx} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 uppercase tracking-wide font-medium">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="w-[35%] space-y-10 border-l border-slate-100 pl-10">
                    {/* Education */}
                    <section>
                        <h2 className="text-sm font-bold uppercase text-slate-800 border-b-2 border-slate-900 pb-2 mb-6 tracking-wider">
                            Education
                        </h2>
                        <div className="space-y-6">
                            {content.education.map((edu, idx) => (
                                <div key={idx}>
                                    <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                                    <p className="text-xs font-medium text-slate-600 mb-1">{edu.institution}</p>
                                    <p className="text-xs font-light italic text-slate-400">{edu.startDate} - {edu.endDate || 'Present'}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <h2 className="text-sm font-bold uppercase text-slate-800 border-b-2 border-slate-900 pb-2 mb-6 tracking-wider">
                            Skills
                        </h2>
                        <div className="space-y-4">
                            {/* Group skills if possible, else list */}
                            {content.skills && (() => {
                                // Simple grouping logic
                                const groups: Record<string, any[]> = {};
                                content.skills.forEach((s: any) => {
                                    const cat = s.category || 'Other';
                                    if (!groups[cat]) groups[cat] = [];
                                    groups[cat].push(s);
                                });

                                return Object.entries(groups).map(([cat, skills], idx) => (
                                    <div key={idx}>
                                        <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">{cat}</h3>
                                        <ul className="space-y-1">
                                            {skills.map((skill, sIdx) => (
                                                <li key={sIdx} className="text-xs font-medium text-slate-700 border-b border-slate-50 pb-1 last:border-0">
                                                    {skill.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ));
                            })()}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
