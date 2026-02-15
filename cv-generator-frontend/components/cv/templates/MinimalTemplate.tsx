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
const C = {
    white: '#ffffff',
    ink: '#0a0a0a',
    inkMid: '#2c2c2c',
    inkSoft: '#6e6e6e',
    inkFaint: '#b8b8b8',
    inkGhost: '#e8e8e8',
    red: '#c0392b',   /* single accent — used sparingly */
    bg: '#ffffff',
} as const;

const F = {
    display: "'Cormorant Garamond', 'Garamond', 'Times New Roman', serif",
    body: "'Garamond', 'Georgia', 'Times New Roman', serif",
    label: "'Garamond', 'Georgia', serif",
} as const;

/* ─── Section heading — left-rule style ─────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.4rem',
        }}>
            <span style={{
                display: 'inline-block',
                width: '1.5rem',
                height: '1px',
                background: C.red,
                flexShrink: 0,
            }} />
            <h2 style={{
                fontFamily: F.label,
                fontSize: '0.55rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: C.inkSoft,
            }}>
                {children}
            </h2>
        </div>
    );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function MinimalTemplate({
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

    /* Group skills */
    const skillGroups: { category: string; skills: any[] }[] = content.skills
        ? content.skills.reduce((acc: any[], skill: any) => {
            const cat = skill.category || 'Skills';
            const existing = acc.find((g: any) => g.category === cat);
            if (existing) existing.skills.push(skill);
            else acc.push({ category: cat, skills: [skill] });
            return acc;
        }, [])
        : [];

    const photoUrl = cv.cvSpecificPhotoUrl || (cv.includeProfilePicture ? profile?.profilePictureUrl : null);

    return (
        <div
            id="cv-preview"
            style={{
                maxWidth: '21cm',
                minHeight: '29.7cm',
                margin: '0 auto',
                background: C.bg,
                fontFamily: F.body,
                color: C.ink,
                display: 'grid',
                /* Narrow left gutter | content */
                gridTemplateColumns: '2.2rem 1fr',
            }}
        >
            {/* ══════════════════════════════
                LEFT GUTTER — vertical name + red rule
            ══════════════════════════════ */}
            <div style={{
                borderRight: `1px solid ${C.inkGhost}`,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {/* Vertical name — rotated */}
                <p style={{
                    fontFamily: F.label,
                    fontSize: '0.5rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: C.inkFaint,
                    fontWeight: 700,
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                }}>
                    {profile?.fullName}
                </p>

                {/* Red accent dot at top */}
                <span style={{
                    position: 'absolute',
                    top: '2.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0.35rem',
                    height: '0.35rem',
                    borderRadius: '50%',
                    background: C.red,
                }} />
            </div>

            {/* ══════════════════════════════
                MAIN AREA
            ══════════════════════════════ */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>

                {/* ── HEADER ── */}
                <header style={{
                    padding: '2.8rem 2.6rem 2rem',
                    borderBottom: `1px solid ${C.inkGhost}`,
                    display: 'grid',
                    gridTemplateColumns: photoUrl ? '1fr auto auto' : '1fr auto',
                    gap: '1.5rem',
                    alignItems: 'center',
                }}>
                    {/* Name + role */}
                    <div>
                        <h1 style={{
                            fontFamily: F.display,
                            fontSize: '3.2rem',
                            fontWeight: 300,
                            letterSpacing: '-0.01em',
                            lineHeight: 1.0,
                            color: C.ink,
                            marginBottom: '0.8rem',
                        }}>
                            {/* First name normal weight, last name in red */}
                            {profile?.fullName?.split(' ').slice(0, -1).join(' ')}{' '}
                            <span style={{ color: C.red, fontWeight: 600 }}>
                                {profile?.fullName?.split(' ').slice(-1)}
                            </span>
                        </h1>

                        <p style={{
                            fontFamily: F.label,
                            fontSize: '0.68rem',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: C.inkSoft,
                            fontWeight: 400,
                        }}>
                            {cv.jobPosting?.jobTitle}
                            {cv.jobPosting?.company && (
                                <span style={{ color: C.inkFaint }}> / {cv.jobPosting.company}</span>
                            )}
                        </p>
                    </div>

                    {/* Contact — right aligned, stacked */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '0.3rem',
                        paddingBottom: '0.1rem',
                    }}>
                        {[
                            profile?.email,
                            profile?.phone,
                            profile?.location,
                        ].filter(Boolean).map((val, idx) => (
                            <p key={idx} style={{
                                fontFamily: F.label,
                                fontSize: '0.68rem',
                                color: C.inkSoft,
                                lineHeight: 1.4,
                                textAlign: 'right',
                            }}>
                                {val}
                            </p>
                        ))}
                        {profile?.linkedinUrl && (
                            <a
                                href={profile.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    fontFamily: F.label,
                                    fontSize: '0.65rem',
                                    color: C.red,
                                    textDecoration: 'none',
                                    borderBottom: `1px solid rgba(192,57,43,0.3)`,
                                }}
                            >
                                LinkedIn
                            </a>
                        )}
                    </div>

                    {/* Photo - Optional */}
                    {photoUrl && (
                        <div style={{
                            width: '4rem',
                            height: '4rem',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            marginLeft: '0.5rem',
                            border: `2px solid ${C.inkGhost}`,
                        }}>
                            <img
                                src={photoUrl}
                                alt="Profile"
                                crossOrigin="anonymous"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </header>

                {/* ── BODY: two-column ── */}
                <div style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: '1fr 15rem',
                    alignItems: 'start',
                }}>

                    {/* ── MAIN COLUMN ── */}
                    <div style={{
                        padding: '2.2rem 2.4rem 2.4rem',
                        borderRight: `1px solid ${C.inkGhost}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2.2rem',
                    }}>

                        {/* Summary */}
                        <section>
                            <SectionLabel>{content.sectionTitles?.professionalSummary || 'Professional Summary'}</SectionLabel>
                            {isEditingSummary ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <textarea
                                        value={editedSummary}
                                        onChange={(e) => setEditedSummary(e.target.value)}
                                        rows={7}
                                        style={{
                                            width: '100%',
                                            padding: '0.85rem',
                                            fontSize: '0.85rem',
                                            fontFamily: F.body,
                                            lineHeight: 1.85,
                                            color: C.inkMid,
                                            background: '#fafafa',
                                            border: `1px solid ${C.inkGhost}`,
                                            outline: 'none',
                                            resize: 'vertical',
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={handleSaveClick}
                                            style={{
                                                fontFamily: F.label,
                                                fontSize: '0.55rem',
                                                letterSpacing: '0.22em',
                                                textTransform: 'uppercase',
                                                fontWeight: 700,
                                                background: C.ink,
                                                color: C.white,
                                                border: 'none',
                                                padding: '0.4rem 1rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditingSummary(false)}
                                            style={{
                                                fontFamily: F.label,
                                                fontSize: '0.55rem',
                                                letterSpacing: '0.22em',
                                                textTransform: 'uppercase',
                                                fontWeight: 700,
                                                background: 'none',
                                                color: C.inkFaint,
                                                border: `1px solid ${C.inkGhost}`,
                                                padding: '0.4rem 1rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ position: 'relative' }} className="group">
                                    <p style={{
                                        fontFamily: F.body,
                                        fontSize: '0.85rem',
                                        lineHeight: 1.88,
                                        color: C.inkMid,
                                        textAlign: 'justify',
                                    }}>
                                        {content.professionalSummary}
                                    </p>
                                    {onUpdateSummary && (
                                        <button
                                            onClick={() => setIsEditingSummary(true)}
                                            className="opacity-0 group-hover:opacity-100"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                fontFamily: F.label,
                                                fontSize: '0.5rem',
                                                letterSpacing: '0.2em',
                                                textTransform: 'uppercase',
                                                color: C.inkFaint,
                                                background: 'none',
                                                border: `1px solid ${C.inkGhost}`,
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

                        {/* Experience */}
                        {content.workExperience && content.workExperience.length > 0 && (
                            <section>
                                <SectionLabel>{content.sectionTitles?.workExperience || 'Experience'}</SectionLabel>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                                    {content.workExperience.map((exp, idx) => (
                                        <div key={idx} style={{ pageBreakInside: 'avoid' }}>
                                            {/* Role + dates row */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'baseline',
                                                gap: '1rem',
                                                marginBottom: '0.2rem',
                                            }}>
                                                <h3 style={{
                                                    fontFamily: F.display,
                                                    fontSize: '1.05rem',
                                                    fontWeight: 600,
                                                    color: C.ink,
                                                    letterSpacing: '-0.01em',
                                                }}>
                                                    {exp.position}
                                                </h3>
                                                <span style={{
                                                    fontFamily: F.label,
                                                    fontSize: '0.6rem',
                                                    color: C.inkFaint,
                                                    letterSpacing: '0.08em',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0,
                                                }}>
                                                    {exp.startDate} — {exp.endDate || 'Present'}
                                                </span>
                                            </div>

                                            {/* Company */}
                                            <p style={{
                                                fontFamily: F.label,
                                                fontSize: '0.65rem',
                                                letterSpacing: '0.16em',
                                                textTransform: 'uppercase',
                                                color: C.red,
                                                fontWeight: 700,
                                                marginBottom: '0.65rem',
                                            }}>
                                                {exp.company}
                                                {exp.location && (
                                                    <span style={{ color: C.inkFaint, fontWeight: 400 }}>
                                                        {' '}· {exp.location}
                                                    </span>
                                                )}
                                            </p>

                                            {/* Description */}
                                            {exp.description && (
                                                <p style={{
                                                    fontFamily: F.body,
                                                    fontSize: '0.8rem',
                                                    color: C.inkMid,
                                                    lineHeight: 1.8,
                                                    textAlign: 'justify',
                                                    marginBottom: '0.5rem',
                                                }}>
                                                    {exp.description}
                                                </p>
                                            )}

                                            {/* Achievements */}
                                            {exp.achievements && exp.achievements.length > 0 && (
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.3rem',
                                                    paddingLeft: '0.1rem',
                                                }}>
                                                    {exp.achievements.map((ach, i) => (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                                                            <span style={{
                                                                marginTop: '0.52rem',
                                                                flexShrink: 0,
                                                                width: '0.22rem',
                                                                height: '0.22rem',
                                                                background: C.red,
                                                                borderRadius: '50%',
                                                            }} />
                                                            <span style={{
                                                                fontFamily: F.body,
                                                                fontSize: '0.76rem',
                                                                color: C.inkSoft,
                                                                lineHeight: 1.7,
                                                            }}>
                                                                {ach}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {content.projects && content.projects.length > 0 && (
                            <section>
                                <SectionLabel>{content.sectionTitles?.projects || 'Selected Works'}</SectionLabel>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1rem 2rem',
                                }}>
                                    {content.projects.map((proj, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                paddingTop: '0.8rem',
                                                borderTop: `1px solid ${C.inkGhost}`,
                                                pageBreakInside: 'avoid',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                                <h3 style={{
                                                    fontFamily: F.display,
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600,
                                                    color: C.ink,
                                                }}>
                                                    {proj.name}
                                                </h3>
                                                {proj.url && (
                                                    <a
                                                        href={proj.url}
                                                        style={{
                                                            fontFamily: F.label,
                                                            fontSize: '0.5rem',
                                                            letterSpacing: '0.18em',
                                                            textTransform: 'uppercase',
                                                            color: C.red,
                                                            textDecoration: 'none',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        View →
                                                    </a>
                                                )}
                                            </div>
                                            <p style={{
                                                fontFamily: F.body,
                                                fontSize: '0.73rem',
                                                color: C.inkSoft,
                                                lineHeight: 1.65,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            } as React.CSSProperties}>
                                                {proj.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* ── SIDEBAR COLUMN ── */}
                    <div style={{
                        padding: '2.2rem 1.8rem 2.4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                    }}>

                        {/* Education */}
                        {content.education && content.education.length > 0 && (
                            <section>
                                <SectionLabel>{content.sectionTitles?.education || 'Education'}</SectionLabel>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {content.education.map((edu, idx) => (
                                        <div key={idx}>
                                            <p style={{
                                                fontFamily: F.display,
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                color: C.ink,
                                                lineHeight: 1.3,
                                                marginBottom: '0.2rem',
                                            }}>
                                                {edu.institution}
                                            </p>
                                            <p style={{
                                                fontFamily: F.body,
                                                fontSize: '0.72rem',
                                                fontStyle: 'italic',
                                                color: C.inkSoft,
                                                lineHeight: 1.4,
                                                marginBottom: '0.25rem',
                                            }}>
                                                {edu.degree}
                                                {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                                            </p>
                                            <p style={{
                                                fontFamily: F.label,
                                                fontSize: '0.58rem',
                                                letterSpacing: '0.1em',
                                                color: C.inkFaint,
                                                textTransform: 'uppercase',
                                            }}>
                                                {edu.startDate} – {edu.endDate || 'Present'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills */}
                        {skillGroups.length > 0 && (
                            <section>
                                <SectionLabel>{content.sectionTitles?.skills || 'Skills'}</SectionLabel>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                    {skillGroups.map((group, gIdx) => (
                                        <div key={gIdx}>
                                            {skillGroups.length > 1 && (
                                                <p style={{
                                                    fontFamily: F.label,
                                                    fontSize: '0.52rem',
                                                    letterSpacing: '0.18em',
                                                    textTransform: 'uppercase',
                                                    color: C.inkFaint,
                                                    fontWeight: 700,
                                                    marginBottom: '0.4rem',
                                                }}>
                                                    {group.category}
                                                </p>
                                            )}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem' }}>
                                                {group.skills.map((s: any, sIdx: number) => (
                                                    <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{
                                                            width: '0.2rem',
                                                            height: '0.2rem',
                                                            borderRadius: '50%',
                                                            background: C.red,
                                                            flexShrink: 0,
                                                        }} />
                                                        <span style={{
                                                            fontFamily: F.body,
                                                            fontSize: '0.75rem',
                                                            color: C.inkMid,
                                                            lineHeight: 1.5,
                                                        }}>
                                                            {s.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <footer style={{
                    borderTop: `1px solid ${C.inkGhost}`,
                    padding: '0.6rem 2.6rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <p style={{
                        fontFamily: F.label,
                        fontSize: '0.5rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: C.inkGhost,
                    }}>
                        {profile?.email}
                    </p>
                    <span style={{
                        display: 'inline-block',
                        width: '0.3rem',
                        height: '0.3rem',
                        borderRadius: '50%',
                        background: C.red,
                        opacity: 0.5,
                    }} />
                    <p style={{
                        fontFamily: F.label,
                        fontSize: '0.5rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: C.inkGhost,
                    }}>
                        {profile?.fullName}
                    </p>
                </footer>
            </div>
        </div>
    );
}