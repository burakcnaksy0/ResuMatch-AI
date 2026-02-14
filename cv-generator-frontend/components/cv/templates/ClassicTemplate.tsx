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

export default function ClassicTemplate({
    cv,
    onUpdateSummary,
    isEditingSummary,
    editedSummary,
    setEditedSummary,
    setIsEditingSummary,
    handleSaveClick,
}: TemplateProps) {
    const { profile, generatedContent: content } = cv;
    if (!content) return null;

    // Group skills by category
    const skillGroups = content.skills
        ? content.skills.reduce((acc: any[], skill: any) => {
            const category = skill.category || 'Competencies';
            const existing = acc.find((g) => g.category === category);
            if (existing) existing.skills.push(skill);
            else acc.push({ category, skills: [skill] });
            return acc;
        }, [])
        : [];

    return (
        <div
            id="cv-preview"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-white text-[#1a1a1a]"
        >
            {/* ── LEFT SIDEBAR + MAIN COLUMN LAYOUT ── */}
            <div className="flex min-h-[29.7cm]">

                {/* ── SIDEBAR ── */}
                <aside
                    className="w-[6.5cm] flex-shrink-0 flex flex-col"
                    style={{ background: '#1a1a1a', color: '#f5f0eb' }}
                >
                    {/* Name block */}
                    <div className="px-8 pt-12 pb-8 border-b border-white border-opacity-10">
                        <p
                            className="text-xs uppercase tracking-[0.25em] mb-3"
                            style={{ color: '#c8a96e', letterSpacing: '0.2em' }}
                        >
                            Curriculum Vitae
                        </p>
                        <h1
                            className="text-[1.7rem] font-bold leading-tight mb-1"
                            style={{ fontFamily: "'Georgia', serif", color: '#f5f0eb' }}
                        >
                            {profile?.fullName?.split(' ').slice(0, -1).join(' ')}
                        </h1>
                        <h1
                            className="text-[1.7rem] font-bold leading-tight"
                            style={{ fontFamily: "'Georgia', serif", color: '#c8a96e' }}
                        >
                            {profile?.fullName?.split(' ').slice(-1)}
                        </h1>

                        <div className="mt-4 h-[2px] w-8" style={{ background: '#c8a96e' }} />

                        <p
                            className="mt-3 text-[0.72rem] uppercase tracking-widest"
                            style={{ color: '#a09080' }}
                        >
                            {cv.jobPosting?.jobTitle}
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="px-8 py-6 border-b border-white border-opacity-10">
                        <h2
                            className="text-[0.6rem] uppercase tracking-[0.25em] mb-4 font-bold"
                            style={{ color: '#c8a96e' }}
                        >
                            Contact
                        </h2>
                        <div className="space-y-2">
                            {profile?.email && (
                                <div>
                                    <p className="text-[0.6rem] uppercase tracking-wider mb-0.5" style={{ color: '#a09080' }}>Email</p>
                                    <p className="text-[0.72rem] break-all" style={{ color: '#e8e0d5' }}>{profile.email}</p>
                                </div>
                            )}
                            {profile?.phone && (
                                <div>
                                    <p className="text-[0.6rem] uppercase tracking-wider mb-0.5" style={{ color: '#a09080' }}>Phone</p>
                                    <p className="text-[0.72rem]" style={{ color: '#e8e0d5' }}>{profile.phone}</p>
                                </div>
                            )}
                            {profile?.location && (
                                <div>
                                    <p className="text-[0.6rem] uppercase tracking-wider mb-0.5" style={{ color: '#a09080' }}>Location</p>
                                    <p className="text-[0.72rem]" style={{ color: '#e8e0d5' }}>{profile.location}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    {skillGroups.length > 0 && (
                        <div className="px-8 py-6 border-b border-white border-opacity-10">
                            <h2
                                className="text-[0.6rem] uppercase tracking-[0.25em] mb-4 font-bold"
                                style={{ color: '#c8a96e' }}
                            >
                                Technical Skills
                            </h2>
                            <div className="space-y-4">
                                {skillGroups.map((group: any, idx: number) => (
                                    <div key={idx}>
                                        <p
                                            className="text-[0.6rem] uppercase tracking-wider mb-1.5"
                                            style={{ color: '#a09080' }}
                                        >
                                            {group.category}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {group.skills.map((s: any, i: number) => (
                                                <span
                                                    key={i}
                                                    className="text-[0.65rem] px-2 py-0.5 rounded-sm"
                                                    style={{
                                                        background: 'rgba(200, 169, 110, 0.12)',
                                                        color: '#d4c4a8',
                                                        border: '1px solid rgba(200, 169, 110, 0.25)',
                                                    }}
                                                >
                                                    {s.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {content.education && content.education.length > 0 && (
                        <div className="px-8 py-6">
                            <h2
                                className="text-[0.6rem] uppercase tracking-[0.25em] mb-4 font-bold"
                                style={{ color: '#c8a96e' }}
                            >
                                Education
                            </h2>
                            <div className="space-y-4">
                                {content.education.map((edu, idx) => (
                                    <div key={idx}>
                                        <p
                                            className="text-[0.75rem] font-bold leading-snug"
                                            style={{ color: '#e8e0d5' }}
                                        >
                                            {edu.institution}
                                        </p>
                                        <p className="text-[0.7rem] italic mt-0.5" style={{ color: '#c4b89a' }}>
                                            {edu.degree} — {edu.fieldOfStudy}
                                        </p>
                                        <p className="text-[0.62rem] mt-1" style={{ color: '#a09080' }}>
                                            {edu.startDate} – {edu.endDate || 'Present'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Applying for — bottom */}
                    {cv.jobPosting?.company && (
                        <div
                            className="mt-auto px-8 py-5"
                            style={{ background: 'rgba(200,169,110,0.08)', borderTop: '1px solid rgba(200,169,110,0.2)' }}
                        >
                            <p className="text-[0.6rem] uppercase tracking-widest mb-1" style={{ color: '#a09080' }}>
                                Applying to
                            </p>
                            <p className="text-[0.78rem] font-bold" style={{ color: '#c8a96e' }}>
                                {cv.jobPosting.company}
                            </p>
                        </div>
                    )}
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className="flex-1 px-10 pt-12 pb-10 flex flex-col gap-8">

                    {/* Professional Summary */}
                    <section>
                        <SectionHeading>Professional Summary</SectionHeading>
                        {isEditingSummary ? (
                            <div className="space-y-2">
                                <textarea
                                    value={editedSummary}
                                    onChange={(e) => setEditedSummary(e.target.value)}
                                    className="w-full p-3 text-sm border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-amber-700"
                                    style={{ fontFamily: 'Georgia, serif', lineHeight: '1.75' }}
                                    rows={6}
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsEditingSummary(false)}
                                        className="px-4 py-1.5 text-xs uppercase tracking-wider bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveClick}
                                        className="px-4 py-1.5 text-xs uppercase tracking-wider text-white font-bold transition-colors"
                                        style={{ background: '#1a1a1a' }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start group">
                                <p
                                    className="text-[0.82rem] text-justify leading-[1.85] text-gray-700"
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    {content.professionalSummary}
                                </p>
                                {onUpdateSummary && (
                                    <button
                                        onClick={() => setIsEditingSummary(true)}
                                        className="ml-3 mt-0.5 flex-shrink-0 text-[0.6rem] uppercase tracking-widest text-gray-300 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all border border-gray-200 hover:border-gray-400 px-2 py-1"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Experience */}
                    {content.workExperience && content.workExperience.length > 0 && (
                        <section>
                            <SectionHeading>Experience</SectionHeading>
                            <div className="space-y-7">
                                {content.workExperience.map((exp, idx) => (
                                    <div key={idx} className="break-inside-avoid">
                                        {/* Role header row */}
                                        <div className="flex justify-between items-start gap-2 mb-1">
                                            <h3
                                                className="text-[0.9rem] font-bold leading-snug"
                                                style={{ color: '#1a1a1a' }}
                                            >
                                                {exp.position}
                                            </h3>
                                            <span
                                                className="text-[0.68rem] italic flex-shrink-0 mt-0.5"
                                                style={{ color: '#8a7968' }}
                                            >
                                                {exp.startDate} – {exp.endDate || 'Present'}
                                            </span>
                                        </div>

                                        {/* Company + location */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="text-[0.72rem] font-semibold uppercase tracking-wider"
                                                style={{ color: '#c8a96e' }}
                                            >
                                                {exp.company}
                                            </span>
                                            {exp.location && (
                                                <>
                                                    <span className="text-gray-300">·</span>
                                                    <span className="text-[0.68rem] text-gray-500">{exp.location}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {exp.description && (
                                            <p
                                                className="text-[0.78rem] text-justify leading-[1.75] text-gray-600 mb-2"
                                                style={{ fontFamily: 'Georgia, serif' }}
                                            >
                                                {exp.description}
                                            </p>
                                        )}

                                        {/* Achievements */}
                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <ul className="space-y-1 mt-1">
                                                {exp.achievements.map((ach, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span
                                                            className="mt-[6px] flex-shrink-0 w-1 h-1 rounded-full"
                                                            style={{ background: '#c8a96e' }}
                                                        />
                                                        <span
                                                            className="text-[0.78rem] leading-[1.65] text-gray-600"
                                                            style={{ fontFamily: 'Georgia, serif' }}
                                                        >
                                                            {ach}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Key Projects */}
                    {content.projects && content.projects.length > 0 && (
                        <section>
                            <SectionHeading>Key Projects</SectionHeading>
                            <div className="space-y-4">
                                {content.projects.map((proj, idx) => (
                                    <div key={idx} className="break-inside-avoid">
                                        <div className="flex justify-between items-baseline mb-1 gap-2">
                                            <h3
                                                className="text-[0.85rem] font-bold"
                                                style={{ color: '#1a1a1a' }}
                                            >
                                                {proj.name}
                                            </h3>
                                            {proj.url && (
                                                <a
                                                    href={proj.url}
                                                    className="text-[0.65rem] uppercase tracking-widest flex-shrink-0"
                                                    style={{ color: '#c8a96e', textDecoration: 'underline' }}
                                                >
                                                    View Project
                                                </a>
                                            )}
                                        </div>
                                        <p
                                            className="text-[0.78rem] text-justify leading-[1.75] text-gray-600"
                                            style={{ fontFamily: 'Georgia, serif' }}
                                        >
                                            {proj.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

/* ── Reusable section heading ── */
function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <h2
                className="text-[0.65rem] uppercase font-bold tracking-[0.22em] flex-shrink-0"
                style={{ color: '#1a1a1a' }}
            >
                {children}
            </h2>
            <div className="flex-1 h-px" style={{ background: '#e0d5c8' }} />
            <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#c8a96e' }} />
        </div>
    );
}