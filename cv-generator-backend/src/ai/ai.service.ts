import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

interface CVGenerationInput {
  profileId: string;
  jobPostingId?: string;
  tone?: string;
  language?: string;
}

interface GeneratedCVContent {
  sectionTitles?: {
    professionalSummary: string;
    workExperience: string;
    education: string;
    skills: string;
    projects: string;
    certifications: string;
    languages: string;
  };
  professionalSummary: string;
  workExperience: Array<{
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    gpa?: number;
    description?: string;
  }>;
  skills: Array<{
    name: string;
    category?: string;
    proficiencyLevel?: string;
  }>;
  projects: Array<{
    name: string;
    description?: string;
    technologies: string[];
    url?: string;
    githubUrl?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
  }>;
  languages: Array<{
    name: string;
    proficiency?: string;
  }>;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const baseURL = this.configService.get<string>('OPENAI_BASE_URL') || 'https://api.openai.com/v1';

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    this.openai = new OpenAI({
      apiKey,
      baseURL,
    });
  }

  async generateCV(input: CVGenerationInput): Promise<GeneratedCVContent> {
    this.logger.log(
      `Generating CV for profile ${input.profileId} ${input.jobPostingId ? `and job ${input.jobPostingId}` : '(General CV)'} with tone: ${input.tone || 'Professional'} and language: ${input.language || 'English'}`,
    );

    // Fetch profile data with all relations
    const profile = await this.prisma.profile.findUnique({
      where: { id: input.profileId },
      include: {
        education: true,
        workExperience: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
      },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Fetch job posting if provided
    let jobPosting: any = null;
    if (input.jobPostingId) {
      jobPosting = await this.prisma.jobPosting.findUnique({
        where: { id: input.jobPostingId },
      });

      if (!jobPosting) {
        throw new Error('Job posting not found');
      }
    }

    // Generate CV using OpenAI/OpenRouter
    const prompt = this.buildPrompt(profile, jobPosting, input.tone, input.language);
    // Use gpt-4o-mini which is much more affordable but still very capable for this task
    // The previous error indicated insufficient credits for gpt-4o with high token limit
    const model = 'gpt-4o-mini';

    try {
      const completion = await this.openai.chat.completions.create({
        model,
        max_tokens: 4000,
        messages: [
          {
            role: 'system',
            content: 'You are an expert CV writer. Output ONLY valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: "json_object" }, // Ensure JSON output
      });

      const responseText = completion.choices[0].message.content;

      if (!responseText) {
        throw new Error('Empty response from AI');
      }

      const generatedContent = JSON.parse(responseText) as GeneratedCVContent;

      this.logger.log('CV generated successfully');
      return generatedContent;
    } catch (error) {
      this.logger.error('Failed to generate CV', error);
      throw new Error(`CV generation failed: ${error.message}`);
    }
  }

  private buildPrompt(profile: any, jobPosting: any | null, tone: string = 'Professional', language: string = 'English'): string {
    const jobContext = jobPosting ? `
**Job Posting:**
- Title: ${jobPosting.jobTitle}
- Company: ${jobPosting.company || 'Not specified'}
- Experience Level: ${jobPosting.experienceLevel || 'Not specified'}
- Required Skills: ${((jobPosting.requiredSkills as string[]) || []).join(', ') || 'Not specified'}
- Keywords: ${((jobPosting.keywords as string[]) || []).join(', ')}
- Description: ${jobPosting.jobDescription}
` : `
**Context:**
This is a general purpose CV based on the candidate's profile. Highlight their strongest skills and experiences to create a comprehensive professional profile.
`;

    const specificInstructions = jobPosting ? `
1. **Professional Summary:** Write a unique, 3-5 sentence summary. It MUST be tailored to the job posting using the candidate's actual experience. Use the requested '${tone}' tone. If '${tone}' is 'Technical', focus heavily on stack and tools. If 'Leadership', focus on management and impact.
2. **Experience & Projects:** Optimize descriptions to match the job requirements. Use action verbs.
3. **Skills:** Highlight skills that match the job's required skills and keywords.
` : `
1. **Professional Summary:** Write a strong, 3-5 sentence professional summary that highlights the candidate's overall expertise, years of experience, and key achievements. Use a '${tone}' tone.
2. **Experience & Projects:** Refine the descriptions to be professional, impact-oriented, and concise. Use strong action verbs.
3. **Skills:** Organize skills logically. Group them if possible (though pure JSON array is requested, use category field effectively).
`;

    return `Generate a ${jobPosting ? 'tailored' : 'comprehensive professional'} CV in ${language} language based on the candidate's profile ${jobPosting ? 'and the job posting requirements' : ''}.

**Style/Tone Requirement:** ${tone}
(Use this tone specifically for the Professional Summary and the descriptions of experiences/projects. Common tones include: Professional, Technical, Leadership, Creative, Academic.)

${jobContext}

**Candidate Profile:**
- Name: ${profile.fullName}
- Phone: ${profile.phone || 'Not provided'}
- Location: ${profile.location || 'Not provided'}
- LinkedIn: ${profile.linkedinUrl || 'Not provided'}
- GitHub: ${profile.githubUrl || 'Not provided'}
- Portfolio: ${profile.portfolioUrl || 'Not provided'}
- Current Summary: ${profile.professionalSummary || 'Not provided'}

**Work Experience:**
${profile.workExperience.map((exp: any) => `
- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})
  Location: ${exp.location || 'Not specified'}
  Description: ${exp.description || 'Not provided'}
  Achievements: ${JSON.stringify(exp.achievements) || 'None'}
`).join('\n')}

**Education:**
${profile.education.map((edu: any) => `
- ${edu.degree} in ${edu.fieldOfStudy || 'Not specified'} from ${edu.institution}
  ${edu.startDate} - ${edu.endDate || 'Present'}
  GPA: ${edu.gpa || 'Not provided'}
  Description: ${edu.description || 'Not provided'}
`).join('\n')}

**Skills:**
${profile.skills.map((skill: any) => `- ${skill.name} (${skill.category || 'General'}, ${skill.proficiencyLevel || 'Not specified'})`).join('\n')}

**Projects:**
${profile.projects.map((proj: any) => `
- ${proj.name}
  Description: ${proj.description || 'Not provided'}
  Technologies: ${JSON.stringify(proj.technologies) || 'None'}
  URL: ${proj.url || 'Not provided'}
  GitHub: ${proj.githubUrl || 'Not provided'}
`).join('\n')}

**Certifications:**
${profile.certifications.map((cert: any) => `- ${cert.name} by ${cert.issuer} (${cert.issueDate})`).join('\n')}

**Languages:**
${profile.languages.map((lang: any) => `- ${lang.name} (${lang.proficiency || 'Not specified'})`).join('\n')}

**Instructions:**
${specificInstructions}
4. **Accuracy:** Do not invent facts.
5. **Categorization:** For the 'Skills' section, assign a RELEVANT TECHNICAL CATEGORY to each skill. Examples: 'Programming Languages', 'Frameworks & Libraries', 'Databases', 'Cloud & DevOps', 'Tools', 'Soft Skills'. Do NOT use a generic 'Skills' category unless absolutely necessary. Group similar technologies together.
    6. **Localization (CRITICAL):** The ENTIRE CV content MUST be in ${language}.
       - Translate all section titles in 'sectionTitles' object to ${language} (e.g., 'Professional Summary' -> 'Profesyonel Özet' if Turkish).
       - Translate the professional summary, experience descriptions, project details, and skills to ${language}.
       - Even if the input profile is in another language, the OUTPUT MUST be in ${language}.

**Output Format:**
Return ONLY a valid JSON object with this exact structure:
{
  "sectionTitles": {
    "professionalSummary": "string",
    "workExperience": "string",
    "education": "string",
    "skills": "string",
    "projects": "string",
    "certifications": "string",
    "languages": "string"
  },
  "professionalSummary": "string",
  "workExperience": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string or null",
      "description": "string",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "string",
      "endDate": "string or null",
      "gpa": number or null,
      "description": "string or null"
    }
  ],
  "skills": [
    {
      "name": "string",
      "category": "string",
      "proficiencyLevel": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "url": "string or null",
      "githubUrl": "string or null"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "issueDate": "string",
      "expiryDate": "string or null"
    }
  ],
  "languages": [
    {
      "name": "string",
      "proficiency": "string"
    }
  ]
}`;
  }

  async analyzeJob(jobDescription: string, profile?: any): Promise<any> {
    this.logger.log('Analyzing job description for: ' + (profile ? profile.fullName : 'Generic'));

    const matchingInstructions = profile ? `
      5. "matchAnalysis": Analyze how well the candidate fits this role.
         - "matchPercentage": estimated 0-100 score based on skills overlapping.
         - "matchingSkills": list of skills from candidate that are relevant.
         - "missingSkills": critical skills from job description that candidate lacks.
         - "strengths": specific strong points in candidate profile for this job.
         - "gaps": specific weaknesses or missing experience.
      ` : '';

    const outputSchema = `{
          "technicalSkills": ["string"],
          "softSkills": ["string"],
          "experienceLevel": "string",
          "keywords": ["string"],
          "roleExpectations": ["string"],
          ${profile ? `"matchAnalysis": {
              "matchPercentage": number,
              "matchingSkills": ["string"],
              "missingSkills": ["string"],
              "strengths": ["string"],
              "gaps": ["string"]
          }` : '"matchAnalysis": null'}
      }`;

    const prompt = `
      Analyze the following job description to extract structured data.
      ${profile ? 'Compare it against the provided Candidate Profile.' : ''}

      JOB DESCRIPTION:
      ${jobDescription}

      ${profile ? `CANDIDATE PROFILE:
      Skills: ${profile.skills?.map((s: any) => s.name).join(', ') || 'None'}
      Experience: ${profile.workExperience?.map((e: any) => e.position + ' at ' + e.company).join(', ') || 'None'}
      Summary: ${profile.professionalSummary || 'None'}
      ` : ''}

      INSTRUCTIONS:
      1. Extract technical skills (hard skills).
      2. Extract soft skills.
      3. Determine experience level (Junior, Mid, Senior, Lead, etc.).
      4. Extract 5-10 key search terms/keywords relevant to this role.
      5. Summarize 3-5 key role expectations (what is expected from this role).
      ${matchingInstructions}

      OUTPUT FORMAT:
      Return ONLY a valid JSON object with this exact structure:
      ${outputSchema}
      `;

    try {
      const model = this.configService.get<string>('OPENAI_MODEL') || 'openai/gpt-4o-mini';
      const completion = await this.openai.chat.completions.create({
        model,
        max_tokens: 1200,
        messages: [
          { role: 'system', content: 'You are an expert HR analyst and technical recruiter. Output valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0].message.content;
      return JSON.parse(content || '{}');
    } catch (error) {
      this.logger.error('Failed to analyze job', error);
      return {
        technicalSkills: [],
        softSkills: [],
        experienceLevel: 'Not specified',
        keywords: [],
        roleExpectations: [],
        matchAnalysis: null
      };
    }
  }
}
