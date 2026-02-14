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

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const T = {
    teal: '#0d7377',
    tealLight: '#14a085',
    tealFaint: 'rgba(13,115,119,0.08)',
    tealBorder: 'rgba(13,115,119,0.22)',
    ink: '#0f1923',
    inkMid: '#3a4553',
    inkSoft: '#6b7a8d',
    inkFaint: '#e8edf2',
    white: '#ffffff',
    offwhite: '#f7f9fb',
    sidebarBg: '#0f1923',
    sidebarText: '#c8d4e0',
    sidebarMid: '#8a9ab0',
    sidebarFaint: 'rgba(255,255,255,0.06)',
} as const;

/* Shared font stacks */
const F = {
    display: "'Georgia', 'Times New Roman', serif",
    body: "'Georgia', 'Times New Roman', serif",
    label: "'Georgia', 'Times New Roman', serif",
} as const;

/* ─── Utility components ─────────────────────────────────────────────────── */
function SideLabel({ children }: { children: React.ReactNode }) {
    return (
        <p style={{
            fontSize: '0.58rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: T.teal,
            fontWeight: 700,
            marginBottom: '0.6rem',
            fontFamily: F.label,
        }}>
            {children}
        </p>
    );
}

function MainHeading({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                    display: 'inline-block',
                    width: '0.22rem',
                    height: '1.1rem',
                    background: T.teal,
                    borderRadius: '2px',
                    flexShrink: 0,
                }} />
                <h2 style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    color: T.ink,
                    fontFamily: F.label,
                }}>
                    {children}
                </h2>
                <div style={{ flex: 1, height: '1px', background: T.inkFaint }} />
            </div>
        </div>
    );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function ModernTemplate({
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

    const photoUrl = cv.cvSpecificPhotoUrl || (cv.includeProfilePicture ? profile?.profilePictureUrl : null);

    const skillGroups = content.skills
        ? content.skills.reduce((acc: any[], skill: any) => {
            const cat = skill.category || 'Skills';
            const existing = acc.find((g: any) => g.category === cat);
            if (existing) existing.skills.push(skill);
            else acc.push({ category: cat, skills: [skill] });
            return acc;
        }, [])
        : [];

    return (
        <div
            id="cv-preview"
            style={{
                maxWidth: '21cm',
                minHeight: '29.7cm',
                margin: '0 auto',
                background: T.white,
                display: 'flex',
                flexDirection: 'row',
                fontFamily: F.display,
                color: T.ink,
            }}
        >
            {/* ══════════════════════════════
                SIDEBAR  (left, ~33%)
            ══════════════════════════════ */}
            <aside style={{
                width: '33%',
                flexShrink: 0,
                background: T.sidebarBg,
                display: 'flex',
                flexDirection: 'column',
            }}>

                {/* Top accent stripe */}
                <div style={{ height: '3px', background: `linear-gradient(90deg, ${T.teal}, ${T.tealLight})` }} />

                {/* Photo + name block */}
                <div style={{
                    padding: '2rem 1.8rem 1.6rem',
                    borderBottom: `1px solid ${T.sidebarFaint}`,
                }}>
                    {/* Profile photo — hexagonal clip */}
                    {photoUrl && (
                        <div style={{
                            width: '5rem',
                            height: '5rem',
                            marginBottom: '1.2rem',
                            clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
                            overflow: 'hidden',
                            background: T.teal,
                        }}>
                            <img
                                src={photoUrl}
                                alt="Profile"
                                crossOrigin="anonymous"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    )}

                    {/* Job title label */}
                    <p style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: T.teal,
                        fontFamily: F.label,
                        marginBottom: '0.35rem',
                        fontWeight: 700,
                    }}>
                        {cv.jobPosting?.jobTitle || 'Candidate'}
                    </p>
                    <h1 style={{
                        fontSize: '1.45rem',
                        fontWeight: 700,
                        color: T.white,
                        lineHeight: 1.2,
                        fontFamily: F.display,
                    }}>
                        {profile?.fullName?.split(' ').slice(0, -1).join(' ')}{' '}
                        <span style={{ color: T.teal }}>
                            {profile?.fullName?.split(' ').slice(-1)}
                        </span>
                    </h1>

                    {cv.jobPosting?.company && (
                        <p style={{
                            marginTop: '0.6rem',
                            fontSize: '0.65rem',
                            color: T.sidebarMid,
                            fontFamily: F.label,
                        }}>
                            → {cv.jobPosting.company}
                        </p>
                    )}
                </div>

                {/* Contact */}
                <div style={{ padding: '1.4rem 1.8rem', borderBottom: `1px solid ${T.sidebarFaint}` }}>
                    <SideLabel>Contact</SideLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                        {[
                            { label: 'Email', val: profile?.email },
                            { label: 'Phone', val: profile?.phone },
                            { label: 'Location', val: profile?.location },
                        ].filter(i => i.val).map((item, idx) => (
                            <div key={idx}>
                                <p style={{ fontSize: '0.55rem', color: T.sidebarMid, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.15rem', fontFamily: F.label }}>
                                    {item.label}
                                </p>
                                <p style={{ fontSize: '0.7rem', color: T.sidebarText, wordBreak: 'break-all', lineHeight: 1.4 }}>
                                    {item.val}
                                </p>
                            </div>
                        ))}
                        {profile?.linkedinUrl && (
                            <div>
                                <p style={{ fontSize: '0.55rem', color: T.sidebarMid, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.15rem', fontFamily: F.label }}>
                                    LinkedIn
                                </p>
                                <a
                                    href={profile.linkedinUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: '0.7rem', color: T.tealLight, wordBreak: 'break-all' }}
                                >
                                    {profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/i, '')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills */}
                {skillGroups.length > 0 && (
                    <div style={{ padding: '1.4rem 1.8rem', borderBottom: `1px solid ${T.sidebarFaint}` }}>
                        <SideLabel>Skills</SideLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {skillGroups.map((group: any, idx: number) => (
                                <div key={idx}>
                                    <p style={{
                                        fontSize: '0.58rem',
                                        color: T.sidebarMid,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.12em',
                                        marginBottom: '0.5rem',
                                        fontFamily: F.label,
                                    }}>
                                        {group.category}
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                        {group.skills.map((s: any, i: number) => (
                                            <span key={i} style={{
                                                fontSize: '0.62rem',
                                                padding: '0.2rem 0.55rem',
                                                border: `1px solid ${T.tealBorder}`,
                                                borderRadius: '2px',
                                                color: T.sidebarText,
                                                background: T.tealFaint,
                                                fontFamily: F.body,
                                            }}>
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
                    <div style={{ padding: '1.4rem 1.8rem' }}>
                        <SideLabel>Education</SideLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {content.education.map((edu, idx) => (
                                <div key={idx}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: T.white, lineHeight: 1.3 }}>
                                        {edu.institution}
                                    </p>
                                    <p style={{ fontSize: '0.68rem', color: T.teal, fontStyle: 'italic', margin: '0.2rem 0' }}>
                                        {edu.degree} — {edu.fieldOfStudy}
                                    </p>
                                    <p style={{ fontSize: '0.6rem', color: T.sidebarMid, fontFamily: F.label }}>
                                        {edu.startDate} – {edu.endDate || 'Present'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* ══════════════════════════════
                MAIN CONTENT  (right, ~67%)
            ══════════════════════════════ */}
            <main style={{
                flex: 1,
                padding: '2.4rem 2.2rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.8rem',
                background: T.white,
            }}>

                {/* Top teal accent stripe — mirrors sidebar */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    height: '3px',
                    width: '67%',
                    background: `linear-gradient(90deg, ${T.tealLight}, ${T.teal})`,
                    pointerEvents: 'none',
                }} />

                {/* ── Professional Summary ── */}
                <section>
                    <MainHeading>Profile</MainHeading>
                    {isEditingSummary ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <textarea
                                value={editedSummary}
                                onChange={(e) => setEditedSummary(e.target.value)}
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    fontSize: '0.8rem',
                                    border: `1px solid ${T.inkFaint}`,
                                    borderRadius: '4px',
                                    fontFamily: F.body,
                                    lineHeight: 1.75,
                                    resize: 'vertical',
                                    outline: 'none',
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setIsEditingSummary(false)}
                                    style={{
                                        padding: '0.35rem 0.9rem',
                                        fontSize: '0.62rem',
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        background: T.inkFaint,
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveClick}
                                    style={{
                                        padding: '0.35rem 0.9rem',
                                        fontSize: '0.62rem',
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        background: T.teal,
                                        color: T.white,
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }} className="group">
                            <p style={{
                                fontSize: '0.8rem',
                                lineHeight: 1.85,
                                color: T.inkMid,
                                textAlign: 'justify',
                                fontFamily: F.body,
                            }}>
                                {content.professionalSummary}
                            </p>
                            {onUpdateSummary && (
                                <button
                                    onClick={() => setIsEditingSummary(true)}
                                    className="opacity-0 group-hover:opacity-100"
                                    style={{
                                        flexShrink: 0,
                                        fontSize: '0.58rem',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: T.inkSoft,
                                        background: 'none',
                                        border: `1px solid ${T.inkFaint}`,
                                        padding: '0.2rem 0.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* ── Experience ── */}
                {content.workExperience && content.workExperience.length > 0 && (
                    <section>
                        <MainHeading>Experience</MainHeading>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                            {content.workExperience.map((exp, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '5.5rem 1fr',
                                        gap: '0 1rem',
                                        pageBreakInside: 'avoid',
                                    }}
                                >
                                    {/* Date column */}
                                    <div style={{ paddingTop: '0.1rem' }}>
                                        <p style={{
                                            fontSize: '0.58rem',
                                            color: T.teal,
                                            fontFamily: F.label,
                                            lineHeight: 1.5,
                                            textAlign: 'right',
                                        }}>
                                            {exp.endDate || 'Present'}
                                        </p>
                                        <p style={{
                                            fontSize: '0.58rem',
                                            color: T.inkSoft,
                                            fontFamily: F.label,
                                            lineHeight: 1.5,
                                            textAlign: 'right',
                                        }}>
                                            {exp.startDate}
                                        </p>
                                        {/* Vertical connector */}
                                        <div style={{
                                            marginTop: '0.4rem',
                                            marginLeft: 'auto',
                                            width: '1px',
                                            background: `linear-gradient(to bottom, ${T.teal}, transparent)`,
                                            height: '1.5rem',
                                        }} />
                                    </div>

                                    {/* Content column */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            {/* Teal dot */}
                                            <div style={{
                                                width: '0.45rem',
                                                height: '0.45rem',
                                                borderRadius: '50%',
                                                background: T.teal,
                                                flexShrink: 0,
                                            }} />
                                            <h3 style={{
                                                fontSize: '0.88rem',
                                                fontWeight: 700,
                                                color: T.ink,
                                                fontFamily: F.display,
                                            }}>
                                                {exp.position}
                                            </h3>
                                        </div>

                                        <p style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            color: T.teal,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            marginBottom: '0.5rem',
                                            fontFamily: F.label,
                                            paddingLeft: '0.95rem',
                                        }}>
                                            {exp.company}
                                            {exp.location && (
                                                <span style={{ color: T.inkSoft, fontWeight: 400 }}>
                                                    {' '}· {exp.location}
                                                </span>
                                            )}
                                        </p>

                                        {exp.description && (
                                            <p style={{
                                                fontSize: '0.76rem',
                                                color: T.inkMid,
                                                lineHeight: 1.78,
                                                textAlign: 'justify',
                                                fontFamily: F.body,
                                                marginBottom: '0.5rem',
                                                paddingLeft: '0.95rem',
                                            }}>
                                                {exp.description}
                                            </p>
                                        )}

                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <ul style={{
                                                paddingLeft: '0.95rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.3rem',
                                                margin: 0,
                                                listStyle: 'none',
                                            }}>
                                                {exp.achievements.map((ach, i) => (
                                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                                        <span style={{
                                                            marginTop: '0.45rem',
                                                            flexShrink: 0,
                                                            width: '0.3rem',
                                                            height: '0.3rem',
                                                            border: `1.5px solid ${T.teal}`,
                                                            borderRadius: '50%',
                                                        }} />
                                                        <span style={{
                                                            fontSize: '0.74rem',
                                                            color: T.inkMid,
                                                            lineHeight: 1.65,
                                                            fontFamily: F.body,
                                                        }}>
                                                            {ach}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Projects ── */}
                {content.projects && content.projects.length > 0 && (
                    <section>
                        <MainHeading>Projects</MainHeading>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {content.projects.map((proj, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '0.8rem 1rem',
                                        background: T.offwhite,
                                        borderLeft: `2px solid ${T.teal}`,
                                        pageBreakInside: 'avoid',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem', gap: '0.5rem' }}>
                                        <h3 style={{
                                            fontSize: '0.83rem',
                                            fontWeight: 700,
                                            color: T.ink,
                                            fontFamily: F.display,
                                        }}>
                                            {proj.name}
                                        </h3>
                                        {proj.url && (
                                            <a
                                                href={proj.url}
                                                style={{
                                                    fontSize: '0.58rem',
                                                    color: T.teal,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.15em',
                                                    flexShrink: 0,
                                                    fontFamily: F.label,
                                                    textDecoration: 'underline',
                                                }}
                                            >
                                                View →
                                            </a>
                                        )}
                                    </div>

                                    {/* Tech tags */}
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.45rem' }}>
                                            {proj.technologies.slice(0, 5).map((tech: string, tIdx: number) => (
                                                <span key={tIdx} style={{
                                                    fontSize: '0.6rem',
                                                    padding: '0.1rem 0.45rem',
                                                    background: T.tealFaint,
                                                    border: `1px solid ${T.tealBorder}`,
                                                    color: T.teal,
                                                    fontFamily: F.label,
                                                    borderRadius: '2px',
                                                }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: T.inkMid,
                                        lineHeight: 1.72,
                                        textAlign: 'justify',
                                        fontFamily: F.body,
                                    }}>
                                        {proj.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}