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
    bg: '#0e0e0e',
    bgMid: '#161616',
    bgCard: '#1c1c1c',
    bgHover: '#222222',
    border: 'rgba(255,255,255,0.07)',
    borderMid: 'rgba(255,255,255,0.12)',
    neon: '#00e5a0',
    neonFaint: 'rgba(0,229,160,0.10)',
    neonBorder: 'rgba(0,229,160,0.25)',
    white: '#f0ede8',
    whiteMid: '#b8b4ae',
    whitesoft: '#6e6b65',
    whiteghost: '#3a3835',
} as const;

const F = {
    display: "'Cormorant Garamond', 'Garamond', 'Times New Roman', serif",
    body: "'Garamond', 'Georgia', serif",
    label: "'Garamond', 'Georgia', serif",
} as const;

/* ─── Section heading ────────────────────────────────────────────────────── */
function SectionHead({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.4rem',
        }}>
            <span style={{
                display: 'inline-block',
                width: '0.55rem',
                height: '0.55rem',
                background: C.neon,
                borderRadius: '50%',
                flexShrink: 0,
            }} />
            <h2 style={{
                fontFamily: F.label,
                fontSize: '0.55rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: C.neon,
            }}>
                {children}
            </h2>
            <div style={{ flex: 1, height: '1px', background: C.border }} />
        </div>
    );
}

/* ─── Sidebar section heading ────────────────────────────────────────────── */
function SideHead({ children }: { children: React.ReactNode }) {
    return (
        <p style={{
            fontFamily: F.label,
            fontSize: '0.52rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: C.neon,
            marginBottom: '0.9rem',
            borderBottom: `1px solid ${C.border}`,
            paddingBottom: '0.5rem',
        }}>
            {children}
        </p>
    );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function CreativeTemplate({
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

    const firstName = profile?.fullName?.split(' ')[0] ?? '';
    const lastName = profile?.fullName?.split(' ').slice(1).join(' ') ?? '';
    const initials = (firstName[0] ?? '') + (lastName[0] ?? '');

    const skillGroups: { category: string; skills: any[] }[] = content.skills
        ? content.skills.reduce((acc: any[], skill: any) => {
            const cat = skill.category || 'Skills';
            const ex = acc.find((g: any) => g.category === cat);
            if (ex) ex.skills.push(skill);
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
                background: C.bg,
                display: 'flex',
                flexDirection: 'row',
                fontFamily: F.body,
                color: C.white,
                overflow: 'hidden',
            }}
        >
            {/* ══════════════════════════════
                MAIN COLUMN  (left, ~63%)
            ══════════════════════════════ */}
            <div style={{
                width: '63%',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                borderRight: `1px solid ${C.border}`,
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* Watermark initial */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: '-1rem',
                        left: '-0.5rem',
                        fontFamily: F.display,
                        fontSize: '18rem',
                        fontWeight: 700,
                        color: C.white,
                        opacity: 0.03,
                        lineHeight: 1,
                        userSelect: 'none',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                >
                    {initials}
                </div>

                {/* ── HEADER ── */}
                <header style={{
                    padding: '2.4rem 2.4rem 2rem',
                    borderBottom: `1px solid ${C.border}`,
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Neon top stripe */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: `linear-gradient(90deg, ${C.neon}, transparent)`,
                    }} />

                    {/* Role label */}
                    <p style={{
                        fontFamily: F.label,
                        fontSize: '0.55rem',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: C.neon,
                        fontWeight: 700,
                        marginBottom: '0.7rem',
                    }}>
                        {cv.jobPosting?.jobTitle || 'Professional'}
                        {cv.jobPosting?.company && (
                            <span style={{ color: C.whitesoft }}> · {cv.jobPosting.company}</span>
                        )}
                    </p>

                    {/* Name */}
                    <h1 style={{
                        fontFamily: F.display,
                        fontWeight: 300,
                        lineHeight: 0.95,
                        marginBottom: '1.4rem',
                    }}>
                        <span style={{
                            display: 'block',
                            fontSize: '3.4rem',
                            color: C.white,
                            letterSpacing: '-0.01em',
                        }}>
                            {firstName}
                        </span>
                        <span style={{
                            display: 'block',
                            fontSize: '3.4rem',
                            color: C.neon,
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                        }}>
                            {lastName}
                        </span>
                    </h1>

                    {/* Contact inline */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0 1.6rem',
                        alignItems: 'center',
                    }}>
                        {[profile?.email, profile?.phone, profile?.location]
                            .filter(Boolean)
                            .map((val, idx, arr) => (
                                <React.Fragment key={idx}>
                                    <span style={{
                                        fontFamily: F.label,
                                        fontSize: '0.68rem',
                                        color: C.whiteMid,
                                        letterSpacing: '0.02em',
                                    }}>
                                        {val}
                                    </span>
                                    {idx < arr.length - 1 && (
                                        <span style={{ color: C.whiteghost, fontSize: '0.5rem' }}>·</span>
                                    )}
                                </React.Fragment>
                            ))}
                    </div>
                </header>

                {/* ── BODY ── */}
                <div style={{
                    flex: 1,
                    padding: '2rem 2.4rem 2.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.8rem',
                    position: 'relative',
                    zIndex: 1,
                }}>

                    {/* Summary */}
                    <section>
                        <SectionHead>{content.sectionTitles?.professionalSummary || 'Professional Summary'}</SectionHead>
                        {isEditingSummary ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <textarea
                                    value={editedSummary}
                                    onChange={(e) => setEditedSummary(e.target.value)}
                                    rows={6}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        fontFamily: F.body,
                                        fontSize: '0.82rem',
                                        lineHeight: 1.8,
                                        color: C.white,
                                        background: C.bgCard,
                                        border: `1px solid ${C.borderMid}`,
                                        outline: 'none',
                                        resize: 'vertical',
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => setIsEditingSummary(false)}
                                        style={{
                                            fontFamily: F.label,
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.18em',
                                            textTransform: 'uppercase',
                                            fontWeight: 700,
                                            padding: '0.35rem 0.9rem',
                                            background: 'none',
                                            border: `1px solid ${C.border}`,
                                            color: C.whitesoft,
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
                                            padding: '0.35rem 0.9rem',
                                            background: C.neon,
                                            border: 'none',
                                            color: C.bg,
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
                                    fontSize: '0.82rem',
                                    lineHeight: 1.85,
                                    color: C.whiteMid,
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
                                            letterSpacing: '0.18em',
                                            textTransform: 'uppercase',
                                            color: C.neon,
                                            background: 'none',
                                            border: `1px solid ${C.neonBorder}`,
                                            padding: '0.18rem 0.5rem',
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
                            <SectionHead>{content.sectionTitles?.workExperience || 'Experience'}</SectionHead>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                                {content.workExperience.map((exp, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            paddingLeft: '1rem',
                                            borderLeft: `2px solid ${C.bgCard}`,
                                            pageBreakInside: 'avoid',
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Neon left indicator */}
                                        <div style={{
                                            position: 'absolute',
                                            left: '-2px',
                                            top: '0.35rem',
                                            width: '2px',
                                            height: '0.8rem',
                                            background: C.neon,
                                        }} />

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'baseline',
                                            gap: '1rem',
                                            marginBottom: '0.18rem',
                                        }}>
                                            <h3 style={{
                                                fontFamily: F.display,
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                color: C.white,
                                                letterSpacing: '0.01em',
                                                lineHeight: 1.2,
                                            }}>
                                                {exp.position}
                                            </h3>
                                            <span style={{
                                                fontFamily: F.label,
                                                fontSize: '0.6rem',
                                                color: C.whitesoft,
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0,
                                                letterSpacing: '0.06em',
                                            }}>
                                                {exp.startDate} – {exp.endDate || 'Present'}
                                            </span>
                                        </div>

                                        <p style={{
                                            fontFamily: F.label,
                                            fontSize: '0.62rem',
                                            letterSpacing: '0.14em',
                                            textTransform: 'uppercase',
                                            color: C.neon,
                                            fontWeight: 700,
                                            marginBottom: '0.55rem',
                                        }}>
                                            {exp.company}
                                            {exp.location && (
                                                <span style={{ color: C.whitesoft, fontWeight: 400 }}>
                                                    {' '}· {exp.location}
                                                </span>
                                            )}
                                        </p>

                                        {exp.description && (
                                            <p style={{
                                                fontFamily: F.body,
                                                fontSize: '0.78rem',
                                                color: C.whiteMid,
                                                lineHeight: 1.8,
                                                textAlign: 'justify',
                                                marginBottom: exp.achievements?.length ? '0.5rem' : 0,
                                            }}>
                                                {exp.description}
                                            </p>
                                        )}

                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                {exp.achievements.map((ach, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                                                        <span style={{
                                                            marginTop: '0.5rem',
                                                            flexShrink: 0,
                                                            width: '0.22rem',
                                                            height: '0.22rem',
                                                            background: C.neon,
                                                            borderRadius: '50%',
                                                        }} />
                                                        <span style={{
                                                            fontFamily: F.body,
                                                            fontSize: '0.76rem',
                                                            color: C.whitesoft,
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
                            <SectionHead>{content.sectionTitles?.projects || 'Projects'}</SectionHead>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.8rem',
                            }}>
                                {content.projects.map((proj, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            background: C.bgCard,
                                            padding: '0.9rem 1rem',
                                            borderTop: `2px solid ${C.neon}`,
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
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                color: C.white,
                                                lineHeight: 1.2,
                                            }}>
                                                {proj.name}
                                            </h3>
                                            {proj.url && (
                                                <a
                                                    href={proj.url}
                                                    style={{
                                                        fontFamily: F.label,
                                                        fontSize: '0.5rem',
                                                        letterSpacing: '0.16em',
                                                        textTransform: 'uppercase',
                                                        color: C.neon,
                                                        textDecoration: 'none',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    View →
                                                </a>
                                            )}
                                        </div>

                                        {/* Tech tags */}
                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.4rem' }}>
                                                {proj.technologies.slice(0, 3).map((tech: string, tIdx: number) => (
                                                    <span key={tIdx} style={{
                                                        fontFamily: F.label,
                                                        fontSize: '0.55rem',
                                                        padding: '0.1rem 0.4rem',
                                                        background: C.neonFaint,
                                                        border: `1px solid ${C.neonBorder}`,
                                                        color: C.neon,
                                                    }}>
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <p style={{
                                            fontFamily: F.body,
                                            fontSize: '0.72rem',
                                            color: C.whitesoft,
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
            </div>

            {/* ══════════════════════════════
                SIDEBAR  (right, ~37%)
            ══════════════════════════════ */}
            <aside style={{
                flex: 1,
                background: C.bgMid,
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Photo */}
                {photoUrl && (
                    <div style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative',
                    }}>
                        <img
                            src={photoUrl}
                            alt="Profile"
                            crossOrigin="anonymous"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                filter: 'grayscale(30%) contrast(1.05)',
                            }}
                        />
                        {/* Neon overlay tint at bottom */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '40%',
                            background: `linear-gradient(to top, rgba(0,229,160,0.15), transparent)`,
                        }} />
                    </div>
                )}

                {/* Sidebar content */}
                <div style={{
                    flex: 1,
                    padding: '1.8rem 1.6rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.8rem',
                }}>

                    {/* Contact */}
                    <section>
                        <SideHead>Contact</SideHead>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { label: 'Email', val: profile?.email },
                                { label: 'Phone', val: profile?.phone },
                                { label: 'Location', val: profile?.location },
                            ].filter(i => i.val).map((item, idx) => (
                                <div key={idx}>
                                    <p style={{
                                        fontFamily: F.label,
                                        fontSize: '0.5rem',
                                        letterSpacing: '0.16em',
                                        textTransform: 'uppercase',
                                        color: C.whitesoft,
                                        marginBottom: '0.1rem',
                                    }}>
                                        {item.label}
                                    </p>
                                    <p style={{
                                        fontFamily: F.body,
                                        fontSize: '0.7rem',
                                        color: C.whiteMid,
                                        wordBreak: 'break-all',
                                        lineHeight: 1.4,
                                    }}>
                                        {item.val}
                                    </p>
                                </div>
                            ))}
                            {profile?.linkedinUrl && (
                                <div>
                                    <p style={{
                                        fontFamily: F.label,
                                        fontSize: '0.5rem',
                                        letterSpacing: '0.16em',
                                        textTransform: 'uppercase',
                                        color: C.whitesoft,
                                        marginBottom: '0.1rem',
                                    }}>
                                        LinkedIn
                                    </p>
                                    <a
                                        href={profile.linkedinUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            fontFamily: F.body,
                                            fontSize: '0.68rem',
                                            color: C.neon,
                                            textDecoration: 'none',
                                            wordBreak: 'break-all',
                                        }}
                                    >
                                        {profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/i, '')}
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Skills */}
                    {skillGroups.length > 0 && (
                        <section>
                            <SideHead>{content.sectionTitles?.skills || 'Skills'}</SideHead>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {skillGroups.map((group, gIdx) => (
                                    <div key={gIdx}>
                                        {skillGroups.length > 1 && (
                                            <p style={{
                                                fontFamily: F.label,
                                                fontSize: '0.5rem',
                                                letterSpacing: '0.18em',
                                                textTransform: 'uppercase',
                                                color: C.whitesoft,
                                                marginBottom: '0.4rem',
                                            }}>
                                                {group.category}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                            {group.skills.map((s: any, sIdx: number) => (
                                                <span key={sIdx} style={{
                                                    fontFamily: F.label,
                                                    fontSize: '0.62rem',
                                                    padding: '0.18rem 0.55rem',
                                                    background: C.neonFaint,
                                                    border: `1px solid ${C.neonBorder}`,
                                                    color: C.whiteMid,
                                                }}>
                                                    {s.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {content.education && content.education.length > 0 && (
                        <section>
                            <SideHead>{content.sectionTitles?.education || 'Education'}</SideHead>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                {content.education.map((edu, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            paddingLeft: '0.75rem',
                                            borderLeft: `2px solid ${C.neonBorder}`,
                                        }}
                                    >
                                        <p style={{
                                            fontFamily: F.display,
                                            fontSize: '0.82rem',
                                            fontWeight: 600,
                                            color: C.white,
                                            lineHeight: 1.3,
                                            marginBottom: '0.15rem',
                                        }}>
                                            {edu.institution}
                                        </p>
                                        <p style={{
                                            fontFamily: F.body,
                                            fontSize: '0.7rem',
                                            fontStyle: 'italic',
                                            color: C.whiteMid,
                                            lineHeight: 1.4,
                                            marginBottom: '0.15rem',
                                        }}>
                                            {edu.degree}
                                            {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                                        </p>
                                        <p style={{
                                            fontFamily: F.label,
                                            fontSize: '0.58rem',
                                            color: C.whitesoft,
                                            letterSpacing: '0.08em',
                                        }}>
                                            {edu.startDate} – {edu.endDate || 'Present'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </aside>
        </div>
    );
}