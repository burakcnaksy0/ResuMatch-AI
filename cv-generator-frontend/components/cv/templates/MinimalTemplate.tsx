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

export default function MinimalTemplate({
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
        <div id="cv-preview" className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-white shadow-lg p-20 font-sans antialiased text-slate-800">
            {/* Header - Right Aligned Name */}
            <div className="text-right border-b-2 border-black pb-8 mb-16">
                <h1 className="text-6xl font-thin tracking-tighter text-black mb-2 lowercase leading-[0.8]">{profile?.fullName.split(' ').join('')}</h1>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mt-4">{cv.jobPosting?.jobTitle}</p>

                <div className="flex flex-col gap-1 text-xs font-medium text-slate-400 mt-6 tracking-wide">
                    <span>{profile?.email}</span>
                    <span>{profile?.phone}</span>
                    <span>{profile?.location}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-row-reverse gap-16">
                {/* Main Column */}
                <div className="w-[70%] space-y-16">
                    {/* Summary */}
                    <section>
                        {isEditingSummary ? (
                            <div className="space-y-4">
                                <textarea
                                    value={editedSummary}
                                    onChange={(e) => setEditedSummary(e.target.value)}
                                    className="w-full text-sm leading-8 border-none bg-slate-50 focus:ring-0 resize-none font-light"
                                    rows={8}
                                />
                                <div className="flex justify-start gap-4">
                                    <button onClick={handleSaveClick} className="text-[10px] uppercase font-bold text-black border-b border-black pb-0.5 hover:text-slate-500 hover:border-slate-500">Save Changes</button>
                                    <button onClick={() => setIsEditingSummary(false)} className="text-[10px] uppercase font-bold text-slate-300 hover:text-slate-500">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group">
                                <p className="text-sm font-light leading-8 text-black text-justify">
                                    {content.professionalSummary}
                                </p>
                                {onUpdateSummary && (
                                    <button
                                        onClick={() => setIsEditingSummary(true)}
                                        className="absolute -left-12 top-0 text-[10px] font-bold uppercase text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:text-slate-400 -rotate-90 origin-right translate-x-3"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Experience */}
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 border-b border-slate-100 pb-2">Experience</h2>
                        <div className="space-y-12">
                            {content.workExperience.map((exp, idx) => (
                                <div key={idx} className="relative">
                                    <div className="flex justify-between items-baseline mb-3">
                                        <h3 className="text-lg font-bold text-black tracking-tight">{exp.position}</h3>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{exp.startDate} — {exp.endDate || 'Now'}</span>
                                    </div>
                                    <div className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wide">{exp.company}</div>
                                    <p className="text-sm font-light leading-7 text-slate-600 mb-4">
                                        {exp.description}
                                    </p>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                                        {exp.achievements && exp.achievements.map((ach, i) => (
                                            <span key={i} className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[45%]">• {ach}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects */}
                    {content.projects && content.projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 border-b border-slate-100 pb-2">Selected Works</h2>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                {content.projects.map((proj, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-sm font-bold text-black mb-2">{proj.name}</h3>
                                        <p className="text-xs font-medium text-slate-400 leading-5 line-clamp-3">
                                            {proj.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="w-[30%] pt-2 px-4 border-l border-slate-50 flex flex-col gap-16 text-right">
                    {/* Education */}
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Education</h2>
                        <div className="space-y-8">
                            {content.education.map((edu, idx) => (
                                <div key={idx} className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-black leading-tight mb-1">{edu.degree}</span>
                                    <span className="text-xs font-medium text-slate-400 mb-2">{edu.institution}</span>
                                    <span className="text-[10px] font-mono text-slate-300">{edu.startDate} — {edu.endDate || 'Now'}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Skills</h2>
                        <div className="flex flex-col gap-2 items-end">
                            {content.skills && content.skills.map((skill: any, idx: number) => (
                                <span key={idx} className="text-[11px] font-medium text-slate-600 hover:text-black transition-colors cursor-default">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
