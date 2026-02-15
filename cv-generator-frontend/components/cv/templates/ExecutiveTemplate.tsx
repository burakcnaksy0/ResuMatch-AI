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
    paper: '#faf8f5',
    paperDark: '#f0ece4',
    ink: '#141210',
    inkMid: '#3d3830',
    inkSoft: '#7a7068',
    inkFaint: '#c8c0b4',
    inkGhost: '#e8e2d8',
    gold: '#a07840',
    goldLight: '#c4a060',
    goldFaint: 'rgba(160,120,64,0.10)',
    goldBorder: 'rgba(160,120,64,0.28)',
    white: '#ffffff',
} as const;

const F = {
    display: "'Didot', 'Bodoni MT', 'Playfair Display', 'Times New Roman', serif",
    body: "'Garamond', 'Georgia', 'Times New Roman', serif",
    label: "'Garamond', 'Georgia', 'Times New Roman', serif",
} as const;

/* ─── Micro components ───────────────────────────────────────────────────── */

/** Gold-ruled section heading */
function SectionRule({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.6rem',
        }}>
            <div style={{ height: '1px', background: `linear-gradient(to right, transparent, ${C.goldBorder})` }} />
            <h2 style={{
                fontSize: '0.58rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: C.gold,
                fontFamily: F.label,
                whiteSpace: 'nowrap',
            }}>
                {children}
            </h2>
            <div style={{ height: '1px', background: `linear-gradient(to left, transparent, ${C.goldBorder})` }} />
        </div>
    );
}

/** Gold dot bullet */
function GoldBullet() {
    return (
        <span style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            flexShrink: 0,
            width: '0.28rem',
            height: '0.28rem',
            background: C.gold,
            borderRadius: '50%',
        }} />
    );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function ExecutiveTemplate({
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

    /* Group skills by category */
    const skillGroups: { category: string; skills: any[] }[] = content.skills
        ? content.skills.reduce((acc: any[], skill: any) => {
            const cat = skill.category || 'Expertise';
            const existing = acc.find((g) => g.category === cat);
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
                background: C.paper,
                fontFamily: F.body,
                color: C.ink,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* ── Gold top border (3-line rule) ── */}
            <div style={{ flexShrink: 0 }}>
                <div style={{ height: '4px', background: C.ink }} />
                <div style={{ height: '1.5px', background: C.gold, marginTop: '3px' }} />
            </div>

            {/* ══════════════════════════════
                HEADER
            ══════════════════════════════ */}
            <header style={{
                padding: '2.8rem 3rem 2.2rem',
                borderBottom: `1px solid ${C.inkGhost}`,
                display: 'grid',
                gridTemplateColumns: photoUrl ? 'auto 1fr auto' : '1fr auto',
                gap: '2rem',
                alignItems: 'end',
            }}>
                {/* Photo - Optional */}
                {photoUrl && (
                    <div style={{
                        width: '5.5rem',
                        height: '7rem', // Portrait aspect ratio for executive look
                        border: `1px solid ${C.goldBorder}`,
                        padding: '0.25rem',
                        background: C.white,
                    }}>
                        <img
                            src={photoUrl}
                            alt="Profile"
                            crossOrigin="anonymous"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                )}
                {/* Left: name + title */}
                <div>
                    {/* Overline */}
                    <p style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: C.gold,
                        fontFamily: F.label,
                        marginBottom: '0.6rem',
                        fontWeight: 700,
                    }}>
                        Curriculum Vitae
                    </p>

                    {/* Full name — large display serif */}
                    <h1 style={{
                        fontFamily: F.display,
                        fontSize: '2.9rem',
                        fontWeight: 400,
                        letterSpacing: '0.04em',
                        lineHeight: 1.0,
                        color: C.ink,
                        marginBottom: '0.7rem',
                    }}>
                        {profile?.fullName}
                    </h1>

                    {/* Position */}
                    <p style={{
                        fontFamily: F.label,
                        fontSize: '0.8rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: C.inkSoft,
                        fontWeight: 400,
                    }}>
                        {cv.jobPosting?.jobTitle}
                        {cv.jobPosting?.company && (
                            <span style={{ color: C.goldLight }}> · {cv.jobPosting.company}</span>
                        )}
                    </p>
                </div>

                {/* Right: contact block */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.45rem',
                    paddingBottom: '0.2rem',
                }}>
                    {[
                        profile?.email,
                        profile?.phone,
                        profile?.location,
                    ].filter(Boolean).map((val, idx) => (
                        <p key={idx} style={{
                            fontFamily: F.label,
                            fontSize: '0.72rem',
                            color: C.inkMid,
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
                                fontSize: '0.68rem',
                                color: C.gold,
                                textDecoration: 'none',
                                borderBottom: `1px solid ${C.goldBorder}`,
                                paddingBottom: '1px',
                            }}
                        >
                            LinkedIn Profile
                        </a>
                    )}
                </div>
            </header>

            {/* ══════════════════════════════
                BODY
            ══════════════════════════════ */}
            <div style={{ flex: 1, padding: '2.4rem 3rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* ── Executive Summary ── */}
                <section>
                    <SectionRule>{content.sectionTitles?.professionalSummary || 'Executive Summary'}</SectionRule>
                    {isEditingSummary ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <textarea
                                value={editedSummary}
                                onChange={(e) => setEditedSummary(e.target.value)}
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1.2rem',
                                    fontSize: '0.95rem',
                                    fontFamily: F.body,
                                    fontStyle: 'italic',
                                    lineHeight: 1.85,
                                    color: C.inkMid,
                                    background: C.white,
                                    border: `1px solid ${C.inkGhost}`,
                                    outline: 'none',
                                    resize: 'vertical',
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                                <button
                                    onClick={() => setIsEditingSummary(false)}
                                    style={{
                                        padding: '0.4rem 1.1rem',
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        fontFamily: F.label,
                                        fontWeight: 700,
                                        background: 'none',
                                        border: `1px solid ${C.inkGhost}`,
                                        color: C.inkSoft,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveClick}
                                    style={{
                                        padding: '0.4rem 1.1rem',
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        fontFamily: F.label,
                                        fontWeight: 700,
                                        background: C.ink,
                                        color: C.paper,
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ position: 'relative' }} className="group">
                            {/* Decorative left margin rule */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '2px 1fr',
                                gap: '1.4rem',
                                alignItems: 'start',
                            }}>
                                <div style={{
                                    width: '2px',
                                    height: '100%',
                                    background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
                                    marginTop: '0.3rem',
                                }} />
                                <p style={{
                                    fontFamily: F.body,
                                    fontSize: '0.98rem',
                                    fontStyle: 'italic',
                                    lineHeight: 1.9,
                                    color: C.inkMid,
                                    textAlign: 'justify',
                                }}>
                                    {content.professionalSummary}
                                </p>
                            </div>
                            {onUpdateSummary && (
                                <button
                                    onClick={() => setIsEditingSummary(true)}
                                    className="opacity-0 group-hover:opacity-100"
                                    style={{
                                        position: 'absolute',
                                        top: '-1.6rem',
                                        right: 0,
                                        fontSize: '0.55rem',
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        fontFamily: F.label,
                                        color: C.inkFaint,
                                        background: 'none',
                                        border: `1px solid ${C.inkGhost}`,
                                        padding: '0.2rem 0.6rem',
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

                {/* ── Core Competencies ── */}
                {skillGroups.length > 0 && (
                    <section>
                        <SectionRule>{content.sectionTitles?.skills || 'Skills'}</SectionRule>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))',
                            gap: '0.6rem 2rem',
                        }}>
                            {skillGroups.map((group, gIdx) => (
                                <div key={gIdx}>
                                    {/* Category label — only show if more than one group */}
                                    {skillGroups.length > 1 && (
                                        <p style={{
                                            fontSize: '0.52rem',
                                            letterSpacing: '0.2em',
                                            textTransform: 'uppercase',
                                            color: C.gold,
                                            fontFamily: F.label,
                                            fontWeight: 700,
                                            marginBottom: '0.4rem',
                                        }}>
                                            {group.category}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        {group.skills.map((s: any, sIdx: number) => (
                                            <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                <span style={{
                                                    width: '0.25rem',
                                                    height: '0.25rem',
                                                    background: C.gold,
                                                    borderRadius: '50%',
                                                    flexShrink: 0,
                                                }} />
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    color: C.inkMid,
                                                    fontFamily: F.body,
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

                {/* ── Professional Experience ── */}
                {content.workExperience && content.workExperience.length > 0 && (
                    <section>
                        <SectionRule>{content.sectionTitles?.workExperience || 'Experience'}</SectionRule>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {content.workExperience.map((exp, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr auto',
                                        gap: '0 2rem',
                                        pageBreakInside: 'avoid',
                                    }}
                                >
                                    {/* Left: role details */}
                                    <div>
                                        {/* Position */}
                                        <h3 style={{
                                            fontFamily: F.display,
                                            fontSize: '1.15rem',
                                            fontWeight: 400,
                                            letterSpacing: '0.03em',
                                            color: C.ink,
                                            marginBottom: '0.2rem',
                                            lineHeight: 1.2,
                                        }}>
                                            {exp.position}
                                        </h3>

                                        {/* Company + location */}
                                        <p style={{
                                            fontFamily: F.label,
                                            fontSize: '0.68rem',
                                            letterSpacing: '0.14em',
                                            textTransform: 'uppercase',
                                            color: C.gold,
                                            fontWeight: 700,
                                            marginBottom: '0.75rem',
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
                                                fontSize: '0.82rem',
                                                color: C.inkMid,
                                                lineHeight: 1.8,
                                                textAlign: 'justify',
                                                marginBottom: '0.6rem',
                                            }}>
                                                {exp.description}
                                            </p>
                                        )}

                                        {/* Achievements */}
                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <ul style={{
                                                listStyle: 'none',
                                                padding: 0,
                                                margin: 0,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.4rem',
                                            }}>
                                                {exp.achievements.map((ach, i) => (
                                                    <li key={i} style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '0.65rem',
                                                    }}>
                                                        <GoldBullet />
                                                        <span style={{
                                                            fontFamily: F.body,
                                                            fontSize: '0.8rem',
                                                            color: C.inkMid,
                                                            lineHeight: 1.7,
                                                        }}>
                                                            {ach}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Right: date pill */}
                                    <div style={{
                                        paddingTop: '0.15rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: '0.2rem',
                                        minWidth: '6rem',
                                    }}>
                                        <span style={{
                                            fontFamily: F.label,
                                            fontSize: '0.65rem',
                                            color: C.ink,
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                        }}>
                                            {exp.endDate || 'Present'}
                                        </span>
                                        <div style={{ width: '1.5rem', height: '1px', background: C.gold }} />
                                        <span style={{
                                            fontFamily: F.label,
                                            fontSize: '0.65rem',
                                            color: C.inkSoft,
                                            letterSpacing: '0.05em',
                                        }}>
                                            {exp.startDate}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Education & Projects — two columns ── */}
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: content.projects && content.projects.length > 0 ? '1fr 1fr' : '1fr',
                    gap: '0 3rem',
                    paddingTop: '1.8rem',
                    borderTop: `1px solid ${C.inkGhost}`,
                }}>
                    {/* Education */}
                    <div>
                        <SectionRule>{content.sectionTitles?.education || 'Education'}</SectionRule>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {content.education.map((edu, idx) => (
                                <div key={idx} style={{ pageBreakInside: 'avoid' }}>
                                    <h3 style={{
                                        fontFamily: F.display,
                                        fontSize: '0.95rem',
                                        fontWeight: 400,
                                        color: C.ink,
                                        lineHeight: 1.3,
                                        marginBottom: '0.2rem',
                                    }}>
                                        {edu.institution}
                                    </h3>
                                    <p style={{
                                        fontFamily: F.body,
                                        fontSize: '0.75rem',
                                        fontStyle: 'italic',
                                        color: C.inkSoft,
                                        marginBottom: '0.2rem',
                                    }}>
                                        {edu.degree}
                                        {edu.fieldOfStudy && ` — ${edu.fieldOfStudy}`}
                                    </p>
                                    <p style={{
                                        fontFamily: F.label,
                                        fontSize: '0.6rem',
                                        color: C.gold,
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                    }}>
                                        {edu.startDate} – {edu.endDate || 'Present'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Initiatives / Projects */}
                    {content.projects && content.projects.length > 0 && (
                        <div>
                            <SectionRule>{content.sectionTitles?.projects || 'Key Initiatives'}</SectionRule>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {content.projects.map((proj, idx) => (
                                    <div key={idx} style={{ pageBreakInside: 'avoid' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                            <h3 style={{
                                                fontFamily: F.display,
                                                fontSize: '0.95rem',
                                                fontWeight: 400,
                                                color: C.ink,
                                                lineHeight: 1.3,
                                            }}>
                                                {proj.name}
                                            </h3>
                                            {proj.url && (
                                                <a
                                                    href={proj.url}
                                                    style={{
                                                        fontFamily: F.label,
                                                        fontSize: '0.55rem',
                                                        letterSpacing: '0.15em',
                                                        textTransform: 'uppercase',
                                                        color: C.gold,
                                                        textDecoration: 'none',
                                                        borderBottom: `1px solid ${C.goldBorder}`,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    View
                                                </a>
                                            )}
                                        </div>
                                        <p style={{
                                            fontFamily: F.body,
                                            fontSize: '0.75rem',
                                            color: C.inkSoft,
                                            lineHeight: 1.7,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        } as React.CSSProperties}>
                                            {proj.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* ── Footer rule ── */}
            <div style={{ flexShrink: 0 }}>
                <div style={{ height: '1px', background: C.goldBorder, margin: '0 3rem' }} />
                <div style={{
                    padding: '0.7rem 3rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <p style={{
                        fontFamily: F.label,
                        fontSize: '0.52rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: C.inkFaint,
                    }}>
                        {profile?.fullName}
                    </p>
                    <p style={{
                        fontFamily: F.label,
                        fontSize: '0.52rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: C.gold,
                        opacity: 0.6,
                    }}>
                        Confidential
                    </p>
                </div>
            </div>
        </div>
    );
}