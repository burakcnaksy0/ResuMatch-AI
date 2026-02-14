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

export default function CreativeTemplate({
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

    const photoUrl = cv.cvSpecificPhotoUrl || (cv.includeProfilePicture ? profile?.profilePictureUrl : null);

    return (
        <div id="cv-preview" className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-slate-50 shadow-lg flex flex-row overflow-hidden font-sans">
            {/* Left Column (Main) */}
            <div className="w-[65%] p-10 flex flex-col justify-between">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
                        {profile?.fullName.split(' ')[0]} <span className="text-indigo-600">{profile?.fullName.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-xl font-bold text-slate-400 uppercase tracking-widest border-b-4 border-indigo-600 pb-2 inline-block">
                        {cv.jobPosting?.jobTitle}
                    </p>
                </div>

                {/* Experience */}
                <div className="flex-grow space-y-8">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4 flex items-center gap-2">
                        <span className="w-8 h-1 bg-indigo-600"></span> Experience
                    </h2>
                    {content.workExperience.map((exp, idx) => (
                        <div key={idx} className="group">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-lg font-bold text-slate-900">{exp.position}</h3>
                                <span className="text-sm font-bold text-indigo-500">{exp.startDate} - {exp.endDate || 'Present'}</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">{exp.company}</p>
                            <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-indigo-100 pl-4 group-hover:border-indigo-400 transition-colors">
                                {exp.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                {content.projects && content.projects.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-indigo-600"></span> Projects
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {content.projects.map((proj, idx) => (
                                <div key={idx} className="bg-white p-4 shadow-sm border-t-4 border-indigo-500">
                                    <h3 className="font-bold text-slate-900 mb-1">{proj.name}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-3">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column (Sidebar) */}
            <div className="w-[35%] bg-slate-900 text-white p-10 flex flex-col gap-10">
                {/* Photo */}
                {photoUrl && (
                    <div className="w-full aspect-square bg-indigo-600 p-2 rounded-full mb-4">
                        <img src={photoUrl} className="w-full h-full object-cover rounded-full border-4 border-slate-800" alt="Profile" />
                    </div>
                )}

                {/* Contact */}
                <div>
                    <h3 className="text-indigo-400 font-black uppercase tracking-widest mb-4 text-sm">Contact</h3>
                    <ul className="space-y-3 text-sm font-medium text-slate-300">
                        <li className="flex items-center gap-2 break-all">
                            <span className="w-1 h-1 bg-indigo-500 rounded-full"></span> {profile?.email}
                        </li>
                        {profile?.phone && (
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-indigo-500 rounded-full"></span> {profile.phone}
                            </li>
                        )}
                        {profile?.location && (
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-indigo-500 rounded-full"></span> {profile.location}
                            </li>
                        )}
                    </ul>
                </div>

                {/* Summary */}
                <div>
                    <h3 className="text-indigo-400 font-black uppercase tracking-widest mb-4 text-sm">Profile Summary</h3>
                    {isEditingSummary ? (
                        <div className="space-y-2">
                            <textarea
                                value={editedSummary}
                                onChange={(e) => setEditedSummary(e.target.value)}
                                className="w-full p-2 text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded"
                                rows={8}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditingSummary(false)} className="text-xs px-2 py-1 bg-slate-700 text-white rounded">Cancel</button>
                                <button onClick={handleSaveClick} className="text-xs px-2 py-1 bg-indigo-600 text-white rounded">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative group">
                            <p className="text-xs leading-relaxed text-slate-400 text-justify">
                                {content.professionalSummary}
                            </p>
                            {onUpdateSummary && (
                                <button
                                    onClick={() => setIsEditingSummary(true)}
                                    className="absolute -top-6 right-0 text-[10px] font-bold uppercase text-indigo-400 hover:text-white"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Education */}
                <div>
                    <h3 className="text-indigo-400 font-black uppercase tracking-widest mb-4 text-sm">Education</h3>
                    <div className="space-y-4">
                        {content.education.map((edu, idx) => (
                            <div key={idx} className="border-l-2 border-indigo-900 pl-3">
                                <div className="font-bold text-white text-sm">{edu.degree}</div>
                                <div className="text-xs text-indigo-300 mb-1">{edu.institution}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{edu.startDate} - {edu.endDate || 'Present'}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills - Tag Cloud Style */}
                <div className="flex-grow">
                    <h3 className="text-indigo-400 font-black uppercase tracking-widest mb-4 text-sm">Competencies</h3>
                    <div className="flex flex-wrap gap-2">
                        {content.skills && content.skills.map((skill: any, idx: number) => (
                            <span key={idx} className="text-[10px] font-bold bg-indigo-900/50 text-indigo-200 px-2 py-1 rounded border border-indigo-800/50 hover:bg-indigo-600 hover:text-white transition-colors cursor-default">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
