// src/modules/ai/prompt-builder/prompt-builder.service.ts
import { Injectable } from '@nestjs/common';
import { JobDescription } from '@prisma/client';

@Injectable()
export class PromptBuilderService {
  // ─────────────────────────────────────────────────────────────
  getSystemPrompt(): string {
    return `You are an expert ATS-optimized CV (Resume) writer and career consultant.
Your task is to generate a highly professional, keyword-optimized, ATS-friendly CV based on the user-provided information and job description.
You MUST ensure the CV is tailored specifically to the job description provided and maximizes the candidate’s chances of passing Applicant Tracking Systems (ATS).
---
# INPUTS YOU WILL RECEIVE
1. Candidate Information:
- Full name
- Contact details (email, phone, location, LinkedIn, GitHub, portfolio if available)
- Professional summary (if provided)
- Work experience (companies, roles, responsibilities, achievements)
- Education
- Technical skills
- Certifications
- Projects
2. Job Description:
- Full job posting text
- Required skills
- Preferred skills
- Responsibilities
- Keywords used in the job ad
---
# CORE OBJECTIVES
You MUST:
## 1. ATS OPTIMIZATION
- Extract ALL important keywords from the job description.
- Naturally integrate these keywords into:
  - Professional Summary
  - Work Experience bullet points
  - Skills section
  - Projects section
- Avoid keyword stuffing. Maintain natural readability.
## 2. JOB TAILORING (CRITICAL)
- Rewrite candidate experience to ALIGN with job responsibilities.
- Reorder and emphasize experiences based on relevance to the job.
- Highlight matching technologies first.
- Downplay irrelevant experience without removing it.
## 3. PROFESSIONAL STRUCTURE
The CV must follow this structure:
### HEADER
- Full Name (bold, large)
- Title (aligned with target job role, not generic)
- Contact Information (email, phone, location, LinkedIn, GitHub)
---
### PROFESSIONAL SUMMARY
- 4–6 lines
- Must include:
  - Target role alignment
  - Core technical expertise
  - Years of experience (if applicable)
  - Key achievements or strengths
- Must contain high-value ATS keywords from job description
---
### TECHNICAL SKILLS
Grouped properly:
Example:
- Backend: Java, Spring Boot, Hibernate, REST APIs
- Databases: PostgreSQL, MySQL
- DevOps: Docker, Kubernetes, CI/CD
- Tools: Git, GitHub, Postman
Ensure:
- Skills reflect job description priority
- No random or irrelevant skills
---
### PROFESSIONAL EXPERIENCE
For each role:
- Job Title – Company Name
- Dates
- 4–7 bullet points
Each bullet MUST:
- Start with strong action verbs (Designed, Developed, Optimized, Implemented, Engineered)
- Include measurable impact if possible
- Include relevant keywords from job description
- Focus on system design, scalability, performance, API development, architecture where relevant
---
### PROJECTS
Each project must include:
- Project name
- Short description (1–2 lines)
- Tech stack
- Key achievements
- Relevance to job description
Prioritize projects that match job requirements.
---
### EDUCATION
- University name
- Degree
- Dates
- Relevant coursework (ONLY if relevant to job description)
---
### CERTIFICATIONS (if any)
- Certification name
- Institution
- Year
---
# IMPORTANT ATS RULES
- Do NOT use tables, graphics, icons, or complex formatting
- Use simple clean text formatting
- Avoid fancy symbols or emojis
- Use standard section headers
- Ensure compatibility with ATS parsers
- Use keyword-rich but human-readable language
---
# KEYWORD ENGINE RULE
You MUST:
1. Extract top 10–30 keywords from job description
2. Prioritize them by importance
3. Naturally distribute them across CV sections
4. Ensure at least:
   - 40–60% of job description keywords appear in CV
   - All core required skills are included
---
# OUTPUT FORMAT
Return ONLY the final CV as a VALID JSON OBJECT.
Do NOT:
- Explain anything
- Add commentary
- Include reasoning
- Mention ATS or keywords process
- Output markdown fences around the JSON

JSON SCHEMA:
{
  "summary": "string",
  "experiences": [{
    "id": "string",
    "company": "string",
    "title": "string",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM | null",
    "isCurrent": "boolean",
    "location": "string",
    "bullets": ["string"],
    "relevanceScore": 10
  }],
  "educations": [{
    "id": "string",
    "institution": "string",
    "degree": "string",
    "field": "string",
    "startDate": "YYYY",
    "endDate": "YYYY | null",
    "gpa": "string | null",
    "highlights": ["string"]
  }],
  "skills": [
    {
      "category": "string",
      "items": ["string"]
    }
  ],
  "certifications": [{
    "id": "string",
    "name": "string",
    "issuer": "string",
    "date": "YYYY-MM",
    "expiryDate": "YYYY-MM | null",
    "url": "string | null"
  }],
  "languages": [{
    "language": "string",
    "level": "string"
  }],
  "projects": [{
    "id": "string",
    "name": "string",
    "description": "string",
    "url": "string | null",
    "technologies": ["string"]
  }],
  "metadata": {
    "targetJobTitle": "string",
    "atsKeywordsIncorporated": [
      { "keyword": "string", "tier": "1 | 2 | 3", "placedIn": ["summary","experience","skills"] }
    ],
    "overallMatchScore": 85,
    "missingKeyRequirements": [
      { "requirement": "string", "tier": "1 | 2", "type": "skill | certification" }
    ]
  },
  "atsAnalysis": {
    "hardSkillMatches": [{
      "keyword": "string",
      "tier": "1 | 2 | 3",
      "foundInSection": "string",
      "frequency": 2
    }],
    "hardSkillGaps": [{
      "skill": "string",
      "tier": "1 | 2"
    }],
    "softSkillMatches": ["string"],
    "industryKeywords": ["string"],
    "actionVerbsUsed": ["string"],
    "keywordDensityScore": 80,
    "sectionCompletenessScore": 90,
    "formattingScore": 100,
    "overallReadabilityScore": 90,
    "improvementTips": [
      { "priority": "high | medium | low", "section": "string", "tip": "string" }
    ]
  }
}
---
# FINAL QUALITY BAR
The final CV must be:
- Highly competitive for mid–senior level roles
- Tailored 100% to job description
- Optimized for ATS ranking systems
- Human-readable and recruiter-friendly
- Structured like a real corporate CV used in top tech companies\`;
  }══════════════════
{
  "summary": "string (4-5 sentences, 60-90 words)",

  "experiences": [{
    "id": "string (preserve original ID from profile)",
    "company": "string",
    "title": "string (industry-standard equivalent if non-standard)",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM | null",
    "isCurrent": "boolean",
    "location": "string",
    "bullets": ["string (4-6 bullets, strong verb first, JD keywords woven in)"],
    "relevanceScore": "integer 1-10"
  }],

  "educations": [{
    "id": "string",
    "institution": "string",
    "degree": "string",
    "field": "string",
    "startDate": "YYYY",
    "endDate": "YYYY | null",
    "gpa": "string | null",
    "highlights": ["string"]
  }],

  "skills": [
    {
      "category": "string (e.g., Programming Languages, Frameworks, Cloud & DevOps, Soft Skills)",
      "items": ["string — ordered: Tier 1 JD matches first, then Tier 2, then additional"]
    }
  ],

  "certifications": [{
    "id": "string",
    "name": "string (exact official name)",
    "issuer": "string",
    "date": "YYYY-MM",
    "expiryDate": "YYYY-MM | null",
    "url": "string | null"
  }],

  "languages": [{
    "language": "string",
    "level": "Native | Fluent | Professional | Basic"
  }],

  "projects": [{
    "id": "string",
    "name": "string",
    "description": "string (2 sentences: what+why, then how+outcome)",
    "url": "string | null",
    "technologies": ["string — use JD exact terms where matching"]
  }],

  "metadata": {
    "targetJobTitle": "string (exact from JD — verbatim copy)",
    "atsKeywordsIncorporated": [
      { "keyword": "string", "tier": "1 | 2 | 3", "placedIn": ["summary","experience","skills"] }
    ],
    "overallMatchScore": "integer 20-95",
    "missingKeyRequirements": [
      { "requirement": "string", "tier": "1 | 2", "type": "skill | certification | degree | experience" }
    ]
  },

  "atsAnalysis": {
    "hardSkillMatches": [{
      "keyword": "string",
      "tier": "1 | 2 | 3",
      "foundInSection": "string (comma-separated section names)",
      "frequency": "integer"
    }],
    "hardSkillGaps": [{
      "skill": "string",
      "tier": "1 | 2"
    }],
    "softSkillMatches": ["string"],
    "industryKeywords": ["string"],
    "actionVerbsUsed": ["string"],
    "keywordDensityScore": "integer 0-100",
    "sectionCompletenessScore": "integer 0-100",
    "formattingScore": "integer 0-100",
    "overallReadabilityScore": "integer 0-100 (human recruiter eye-scan quality)",
    "improvementTips": [
      { "priority": "high | medium | low", "section": "string", "tip": "string (specific, actionable)" }
    ]
  }
}`;
  }

  // ─────────────────────────────────────────────────────────────
  // USER PROMPT
  // ─────────────────────────────────────────────────────────────
  buildUserPrompt(profile: any, jobDescription: JobDescription): string {
    // ── Profile completeness checks ──
    const hasExperiences =
      Array.isArray(profile.experiences) && profile.experiences.length > 0;
    const hasEducations =
      Array.isArray(profile.educations) && profile.educations.length > 0;
    const hasSkills =
      Array.isArray(profile.skills) && profile.skills.length > 0;
    const hasCertifications =
      Array.isArray(profile.certifications) &&
      profile.certifications.length > 0;
    const hasLanguages =
      Array.isArray(profile.languages) && profile.languages.length > 0;
    const hasProjects =
      Array.isArray(profile.projects) && profile.projects.length > 0;

    // ── Skills to readable format ──
    const skillsText = hasSkills
      ? (profile.skills as any[])
          .map(
            (s: any) =>
              `  [${s.category ?? 'General'}]: ${(s.items ?? []).join(', ')}`,
          )
          .join('\n')
      : '  ⚠ NO SKILLS PROVIDED — output skills: { technical: [], soft: [], tools: [] }';

    // ── Profile completeness indicator ──
    const profileCompleteness = [
      hasExperiences ? '✓ Experiences' : '✗ Experiences (EMPTY)',
      hasEducations ? '✓ Education' : '✗ Education (EMPTY)',
      hasSkills ? '✓ Skills' : '✗ Skills (EMPTY)',
      hasCertifications ? '✓ Certifications' : '✗ Certifications (EMPTY)',
      hasLanguages ? '✓ Languages' : '✗ Languages (EMPTY)',
      hasProjects ? '✓ Projects' : '✗ Projects (EMPTY)',
    ].join(' | ');

    return `
╔══════════════════════════════════════════════════════╗
║              CANDIDATE MASTER PROFILE                ║
╚══════════════════════════════════════════════════════╝

Profile Completeness:
${profileCompleteness}

⚠ CRITICAL: For every section marked (EMPTY) above → output an EMPTY ARRAY [].
   Do NOT fabricate any content for empty sections. This is non-negotiable.

──────────────────────────────────────────────────────
PERSONAL INFORMATION
──────────────────────────────────────────────────────
Full Name   : ${profile.user?.firstName ?? ''} ${profile.user?.lastName ?? ''}
Headline    : ${profile.headline ?? 'Not provided'}
Summary     : ${profile.summary ?? 'Not provided'}
Location    : ${profile.location ?? 'Not provided'}
Email       : ${profile.user?.email ?? 'Not provided'}
Phone       : ${profile.phone ?? 'Not provided'}
LinkedIn    : ${profile.linkedin ?? 'Not provided'}
GitHub      : ${profile.github ?? 'Not provided'}
Website     : ${profile.website ?? 'Not provided'}

──────────────────────────────────────────────────────
WORK EXPERIENCE ${!hasExperiences ? '— ⚠ EMPTY → output experiences: []' : `(${profile.experiences.length} entries)`}
──────────────────────────────────────────────────────
${
  hasExperiences
    ? this.formatExperiences(profile.experiences)
    : 'No experience data provided. Output experiences: []'
}

──────────────────────────────────────────────────────
EDUCATION ${!hasEducations ? '— ⚠ EMPTY → output educations: []' : ''}
──────────────────────────────────────────────────────
${
  hasEducations
    ? JSON.stringify(profile.educations, null, 2)
    : 'No education data provided. Output educations: []'
}

──────────────────────────────────────────────────────
SKILLS ${!hasSkills ? '— ⚠ EMPTY → output skills: []' : ''}
──────────────────────────────────────────────────────
${skillsText}

──────────────────────────────────────────────────────
CERTIFICATIONS ${!hasCertifications ? '— ⚠ EMPTY → output certifications: []' : ''}
──────────────────────────────────────────────────────
${
  hasCertifications
    ? JSON.stringify(profile.certifications, null, 2)
    : 'No certifications. Output certifications: []'
}

──────────────────────────────────────────────────────
LANGUAGES ${!hasLanguages ? '— ⚠ EMPTY → output languages: []' : ''}
──────────────────────────────────────────────────────
${
  hasLanguages
    ? JSON.stringify(profile.languages, null, 2)
    : 'No languages provided. Output languages: []'
}

──────────────────────────────────────────────────────
PROJECTS ${!hasProjects ? '— ⚠ EMPTY → output projects: []' : ''}
──────────────────────────────────────────────────────
${
  hasProjects
    ? JSON.stringify(profile.projects, null, 2)
    : 'No projects provided. Output projects: []'
}

╔══════════════════════════════════════════════════════╗
║              TARGET JOB DESCRIPTION                  ║
╚══════════════════════════════════════════════════════╝

Position : ${jobDescription.title}
Company  : ${jobDescription.company ?? 'Not specified'}
Location : ${jobDescription.location ?? 'Not specified'}

──────────────────────────────────────────────────────
FULL JOB DESCRIPTION TEXT
──────────────────────────────────────────────────────
${jobDescription.rawText}

╔══════════════════════════════════════════════════════╗
║                 OUTPUT INSTRUCTIONS                  ║
╚══════════════════════════════════════════════════════╝

OUTPUT: Only the JSON object. No preamble. No explanation. No markdown fences.
    `.trim();
  }

  // ─────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────
  private formatExperiences(experiences: any[]): string {
    return experiences
      .map((exp: any, index: number) => {
        const bullets = Array.isArray(exp.description)
          ? exp.description
          : typeof exp.description === 'string'
            ? [exp.description]
            : (exp.bullets ?? []);

        const period = exp.isCurrent
          ? `${exp.startDate ?? '?'} → Present`
          : `${exp.startDate ?? '?'} → ${exp.endDate ?? '?'}`;

        return `
[Experience ${index + 1}]
  ID           : ${exp.id ?? `exp-${index + 1}`}
  Company      : ${exp.company ?? 'Unknown'}
  Title        : ${exp.title ?? 'Unknown'}
  Period       : ${period}
  ${exp.location ? `Location     : ${exp.location}` : ''}
  ${exp.technologies?.length ? `Technologies : ${exp.technologies.join(', ')}` : ''}
  
  RAW BULLETS — REWRITE using JD keyword terminology. Do NOT copy these verbatim.
  Preserve the facts; use JD exact terms where the work aligns:
${
  bullets.length > 0
    ? bullets.map((b: string) => `    • ${b}`).join('\n')
    : '    • No bullets provided — infer responsibilities from job title and company, incorporate relevant JD keywords, but do NOT fabricate specific claims'
}
        `.trim();
      })
      .join('\n\n');
  }
}
