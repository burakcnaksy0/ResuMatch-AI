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
    bg: '#fefefe',
    bgAlt: '#f6f4f1',
    navy: '#0b1f3a',
    navyMid: '#1a3a5c',
    navyLight: '#2d5a8e',
    bronze: '#8b6914',
    bronzeLight: '#b08830',
    bronzeFaint: 'rgba(139,105,20,0.08)',
    bronzeBorder: 'rgba(139,105,20,0.22)',
    ink: '#0f0f0f',
    inkMid: '#2e2e2e',
    inkSoft: '#5e5e5e',
    inkFaint: '#9e9e9e',
    inkGhost: '#e0ddd8',
    white: '#ffffff',
} as const;

const F = {
    display: "'Garamond', 'Georgia', 'Times New Roman', serif",
    body: "'Garamond', 'Georgia', 'Times New Roman', serif",
    label: "'Garamond', 'Georgia', serif",
} as const;

/* ─── Section heading ────────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                    display: 'inline-block',
                    width: '0.9rem',
                    height: '2px',
                    background: C.bronze,
                    flexShrink: 0,
                }} />
                <h2 style={{
                    fontFamily: F.label,
                    fontSize: '0.6rem',
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: C.navy,
                }}>
                    {children}
                </h2>
            </div>
            <div style={{
                marginTop: '0.5rem',
                height: '1px',
                background: `linear-gradient(to right, ${C.bronzeBorder}, ${C.inkGhost}, transparent)`,
            }} />
        </div>
    );
}

/* ─── Sidebar section heading ────────────────────────────────────────────── */
function SideTitle({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <h2 style={{
                fontFamily: F.label,
                fontSize: '0.55rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: C.bronzeLight,
                paddingBottom: '0.4rem',
                borderBottom: `1px solid ${C.bronzeBorder}`,
            }}>
                {children}
            </h2>
        </div>
    );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function ProfessionalTemplate({
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
            const cat = skill.category || 'Competencies';
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
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* ══════════════════════════════
                HEADER — navy with bronze accent
            ══════════════════════════════ */}
            <header style={{
                background: C.navy,
                padding: '2.4rem 2.8rem 0',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Subtle diagonal texture lines */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 40px,
                        rgba(255,255,255,0.012) 40px,
                        rgba(255,255,255,0.012) 41px
                    )`,
                    pointerEvents: 'none',
                }} />

                {/* Content grid */}
                <div style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: photoUrl ? 'auto 1fr auto' : '1fr auto',
                    gap: '2rem',
                    alignItems: 'center', // Changed from 'end' to 'center' for better photo alignment
                    paddingBottom: '1.8rem',
                }}>
                    {/* Photo - Optional */}
                    {photoUrl && (
                        <div style={{
                            width: '6rem',
                            height: '6rem',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: `2px solid ${C.bronze}`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        }}>
                            <img
                                src={photoUrl}
                                alt="Profile"
                                crossOrigin="anonymous"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    {/* Name + title */}
                    <div>
                        <p style={{
                            fontFamily: F.label,
                            fontSize: '0.52rem',
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color: C.bronzeLight,
                            fontWeight: 700,
                            marginBottom: '0.6rem',
                        }}>
                            Professional Profile
                        </p>
                        <h1 style={{
                            fontFamily: F.display,
                            fontSize: '2.75rem',
                            fontWeight: 400,
                            letterSpacing: '0.04em',
                            lineHeight: 1.0,
                            color: C.white,
                            marginBottom: '0.75rem',
                        }}>
                            {profile?.fullName?.split(' ').slice(0, -1).join(' ')}{' '}
                            <span style={{ color: C.bronzeLight, fontWeight: 600 }}>
                                {profile?.fullName?.split(' ').slice(-1)}
                            </span>
                        </h1>
                        <p style={{
                            fontFamily: F.label,
                            fontSize: '0.75rem',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.45)',
                            fontWeight: 400,
                        }}>
                            {cv.jobPosting?.jobTitle}
                            {cv.jobPosting?.company && (
                                <span style={{ color: 'rgba(255,255,255,0.25)' }}>
                                    {' '}· {cv.jobPosting.company}
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Contact block — right */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.55rem',
                        alignItems: 'flex-end',
                        paddingBottom: '0.2rem',
                    }}>
                        {[
                            profile?.email,
                            profile?.phone,
                            profile?.location,
                        ].filter(Boolean).map((val, idx) => (
                            <p key={idx} style={{
                                fontFamily: F.label,
                                fontSize: '0.68rem',
                                color: 'rgba(255,255,255,0.55)',
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
                                    color: C.bronzeLight,
                                    textDecoration: 'none',
                                    borderBottom: `1px solid ${C.bronzeBorder}`,
                                    paddingBottom: '1px',
                                }}
                            >
                                LinkedIn
                            </a>
                        )}
                        {profile?.githubUrl && (
                            <a
                                href={profile.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    fontFamily: F.label,
                                    fontSize: '0.65rem',
                                    color: C.bronzeLight,
                                    textDecoration: 'none',
                                    borderBottom: `1px solid ${C.bronzeBorder}`,
                                    paddingBottom: '1px',
                                }}
                            >
                                GitHub
                            </a>
                        )}
                        {profile?.portfolioUrl && (
                            <a
                                href={profile.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    fontFamily: F.label,
                                    fontSize: '0.65rem',
                                    color: C.bronzeLight,
                                    textDecoration: 'none',
                                    borderBottom: `1px solid ${C.bronzeBorder}`,
                                    paddingBottom: '1px',
                                }}
                            >
                                Portfolio
                            </a>
                        )}
                    </div>
                </div>

                {/* Bronze gradient rule at base of header */}
                <div style={{
                    height: '3px',
                    background: `linear-gradient(90deg, ${C.bronze}, ${C.bronzeLight}, transparent)`,
                }} />
            </header>

            {/* ══════════════════════════════
                BODY — two column
            ══════════════════════════════ */}
            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 13.5rem',
                alignItems: 'start',
            }}>

                {/* ── MAIN COLUMN ── */}
                <div style={{
                    padding: '2.2rem 2.4rem 2.4rem',
                    borderRight: `1px solid ${C.inkGhost}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}>

                    {/* Professional Profile */}
                    <section>
                        <SectionTitle>{content.sectionTitles?.professionalSummary || 'Professional Profile'}</SectionTitle>
                        {isEditingSummary ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <textarea
                                    value={editedSummary}
                                    onChange={(e) => setEditedSummary(e.target.value)}
                                    rows={6}
                                    style={{
                                        width: '100%',
                                        padding: '0.85rem 1rem',
                                        fontFamily: F.body,
                                        fontSize: '0.83rem',
                                        lineHeight: 1.82,
                                        color: C.inkMid,
                                        background: C.bgAlt,
                                        border: `1px solid ${C.inkGhost}`,
                                        outline: 'none',
                                        resize: 'vertical',
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setIsEditingSummary(false)}
                                        style={{
                                            fontFamily: F.label,
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.18em',
                                            textTransform: 'uppercase',
                                            fontWeight: 700,
                                            padding: '0.38rem 1rem',
                                            background: 'none',
                                            border: `1px solid ${C.inkGhost}`,
                                            color: C.inkFaint,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveClick}
                                        style={{
                                            fontFamily: F.label,
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.18em',
                                            textTransform: 'uppercase',
                                            fontWeight: 700,
                                            padding: '0.38rem 1rem',
                                            background: C.navy,
                                            color: C.white,
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
                                <p style={{
                                    fontFamily: F.body,
                                    fontSize: '0.83rem',
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
                                            top: '-1.5rem',
                                            right: 0,
                                            fontFamily: F.label,
                                            fontSize: '0.5rem',
                                            letterSpacing: '0.18em',
                                            textTransform: 'uppercase',
                                            color: C.inkFaint,
                                            background: 'none',
                                            border: `1px solid ${C.inkGhost}`,
                                            padding: '0.18rem 0.55rem',
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

                    {/* Work Experience */}
                    {content.workExperience && content.workExperience.length > 0 && (
                        <section>
                            <SectionTitle>{content.sectionTitles?.workExperience || 'Work Experience'}</SectionTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                                {content.workExperience.map((exp, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '4.8rem 1fr',
                                            gap: '0 1.1rem',
                                            pageBreakInside: 'avoid',
                                        }}
                                    >
                                        {/* Date column */}
                                        <div style={{ paddingTop: '0.12rem', textAlign: 'right' }}>
                                            <p style={{
                                                fontFamily: F.label,
                                                fontSize: '0.58rem',
                                                color: C.bronze,
                                                fontWeight: 700,
                                                lineHeight: 1.4,
                                                letterSpacing: '0.04em',
                                            }}>
                                                {exp.endDate || 'Present'}
                                            </p>
                                            <div style={{ margin: '0.2rem 0 0.2rem auto', width: '1rem', height: '1px', background: C.bronzeBorder }} />
                                            <p style={{
                                                fontFamily: F.label,
                                                fontSize: '0.58rem',
                                                color: C.inkFaint,
                                                lineHeight: 1.4,
                                                letterSpacing: '0.04em',
                                            }}>
                                                {exp.startDate}
                                            </p>
                                        </div>

                                        {/* Content column */}
                                        <div>
                                            {/* Position */}
                                            <h3 style={{
                                                fontFamily: F.display,
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                color: C.navy,
                                                letterSpacing: '0.01em',
                                                lineHeight: 1.2,
                                                marginBottom: '0.18rem',
                                            }}>
                                                {exp.position}
                                            </h3>

                                            {/* Company */}
                                            <p style={{
                                                fontFamily: F.label,
                                                fontSize: '0.63rem',
                                                letterSpacing: '0.14em',
                                                textTransform: 'uppercase',
                                                color: C.bronze,
                                                fontWeight: 700,
                                                marginBottom: '0.6rem',
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
                                                    fontSize: '0.79rem',
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
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                    {exp.achievements.map((ach, i) => (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                                                            <span style={{
                                                                marginTop: '0.5rem',
                                                                flexShrink: 0,
                                                                width: '0.25rem',
                                                                height: '0.25rem',
                                                                background: C.bronze,
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
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {content.projects && content.projects.length > 0 && (
                        <section>
                            <SectionTitle>{content.sectionTitles?.projects || 'Key Projects'}</SectionTitle>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.8rem',
                            }}>
                                {content.projects.map((proj, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            background: C.bgAlt,
                                            padding: '0.9rem 1rem',
                                            borderLeft: `3px solid ${C.bronze}`,
                                            pageBreakInside: 'avoid',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'baseline',
                                            gap: '0.4rem',
                                            marginBottom: '0.3rem',
                                        }}>
                                            <h3 style={{
                                                fontFamily: F.display,
                                                fontSize: '0.88rem',
                                                fontWeight: 600,
                                                color: C.navy,
                                            }}>
                                                {proj.name}
                                            </h3>
                                            {proj.url && (
                                                <a
                                                    href={proj.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        fontFamily: F.label,
                                                        fontSize: '0.52rem',
                                                        letterSpacing: '0.15em',
                                                        textTransform: 'uppercase',
                                                        color: C.bronze,
                                                        textDecoration: 'none',
                                                        flexShrink: 0,
                                                        borderBottom: `1px solid ${C.bronzeBorder}`,
                                                    }}
                                                >
                                                    View →
                                                </a>
                                            )}
                                            {proj.githubUrl && (
                                                <a
                                                    href={proj.githubUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        fontFamily: F.label,
                                                        fontSize: '0.52rem',
                                                        letterSpacing: '0.15em',
                                                        textTransform: 'uppercase',
                                                        color: C.bronze,
                                                        textDecoration: 'none',
                                                        flexShrink: 0,
                                                        borderBottom: `1px solid ${C.bronzeBorder}`,
                                                    }}
                                                >
                                                    Code →
                                                </a>
                                            )}
                                        </div>

                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.4rem' }}>
                                                {proj.technologies.slice(0, 3).map((tech: string, tIdx: number) => (
                                                    <span key={tIdx} style={{
                                                        fontFamily: F.label,
                                                        fontSize: '0.55rem',
                                                        padding: '0.1rem 0.4rem',
                                                        background: C.bronzeFaint,
                                                        border: `1px solid ${C.bronzeBorder}`,
                                                        color: C.bronze,
                                                        letterSpacing: '0.08em',
                                                        textTransform: 'uppercase',
                                                    }}>
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

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
                    padding: '2.2rem 1.7rem 2.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.8rem',
                    background: C.bgAlt,
                    minHeight: '100%',
                }}>

                    {/* Education */}
                    {content.education && content.education.length > 0 && (
                        <section>
                            <SideTitle>{content.sectionTitles?.education || 'Education'}</SideTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                {content.education.map((edu, idx) => (
                                    <div key={idx} style={{ pageBreakInside: 'avoid' }}>
                                        <p style={{
                                            fontFamily: F.display,
                                            fontSize: '0.82rem',
                                            fontWeight: 600,
                                            color: C.navy,
                                            lineHeight: 1.3,
                                            marginBottom: '0.18rem',
                                        }}>
                                            {edu.institution}
                                        </p>
                                        <p style={{
                                            fontFamily: F.body,
                                            fontSize: '0.72rem',
                                            fontStyle: 'italic',
                                            color: C.inkSoft,
                                            lineHeight: 1.4,
                                            marginBottom: '0.18rem',
                                        }}>
                                            {edu.degree}
                                            {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                                        </p>
                                        <p style={{
                                            fontFamily: F.label,
                                            fontSize: '0.58rem',
                                            color: C.bronze,
                                            letterSpacing: '0.1em',
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
                            <SideTitle>{content.sectionTitles?.skills || 'Skills'}</SideTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                {skillGroups.map((group, gIdx) => (
                                    <div key={gIdx}>
                                        {skillGroups.length > 1 && (
                                            <p style={{
                                                fontFamily: F.label,
                                                fontSize: '0.5rem',
                                                letterSpacing: '0.2em',
                                                textTransform: 'uppercase',
                                                color: C.inkFaint,
                                                fontWeight: 700,
                                                marginBottom: '0.4rem',
                                            }}>
                                                {group.category}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                            {group.skills.map((s: any, sIdx: number) => (
                                                <div
                                                    key={sIdx}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        paddingBottom: '0.3rem',
                                                        borderBottom: sIdx < group.skills.length - 1
                                                            ? `1px solid ${C.inkGhost}`
                                                            : 'none',
                                                    }}
                                                >
                                                    <span style={{
                                                        width: '0.22rem',
                                                        height: '0.22rem',
                                                        borderRadius: '50%',
                                                        background: C.bronze,
                                                        flexShrink: 0,
                                                    }} />
                                                    <span style={{
                                                        fontFamily: F.body,
                                                        fontSize: '0.74rem',
                                                        color: C.inkMid,
                                                        lineHeight: 1.4,
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

            {/* ── Footer ── */}
            <footer style={{
                borderTop: `1px solid ${C.inkGhost}`,
                padding: '0.55rem 2.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: C.bg,
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '1.2rem', height: '1px', background: C.bronzeBorder }} />
                    <p style={{
                        fontFamily: F.label,
                        fontSize: '0.5rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: C.bronze,
                        opacity: 0.5,
                    }}>
                        {profile?.fullName}
                    </p>
                </div>
            </footer>
        </div>
    );
}