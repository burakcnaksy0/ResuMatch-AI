import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

interface CVGenerationInput {
  profileId: string;
  jobPostingId: string;
}

interface GeneratedCVContent {
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
      `Generating CV for profile ${input.profileId} and job ${input.jobPostingId}`,
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

    // Fetch job posting
    const jobPosting = await this.prisma.jobPosting.findUnique({
      where: { id: input.jobPostingId },
    });

    if (!jobPosting) {
      throw new Error('Job posting not found');
    }

    // Generate CV using OpenAI/OpenRouter
    const prompt = this.buildPrompt(profile, jobPosting);
    const model = this.configService.get<string>('OPENAI_MODEL') || 'openai/gpt-4o';

    try {
      const completion = await this.openai.chat.completions.create({
        model,
        max_tokens: 3000,
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

  private buildPrompt(profile: any, jobPosting: any): string {
    const keywords = (jobPosting.keywords as string[]) || [];
    const requiredSkills = (jobPosting.requiredSkills as string[]) || [];

    return `Generate a tailored CV based on the candidate's profile and the job posting requirements.

**Job Posting:**
- Title: ${jobPosting.jobTitle}
- Company: ${jobPosting.company || 'Not specified'}
- Experience Level: ${jobPosting.experienceLevel || 'Not specified'}
- Required Skills: ${requiredSkills.join(', ') || 'Not specified'}
- Keywords: ${keywords.join(', ')}
- Description: ${jobPosting.jobDescription}

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
1. Create a compelling professional summary (2-3 sentences) that highlights the candidate's most relevant experience and skills for THIS SPECIFIC JOB
2. Optimize work experience descriptions to emphasize achievements and responsibilities that match the job requirements
3. Highlight skills that match the job's required skills and keywords
4. Reorder and emphasize relevant projects
5. Keep all factual information accurate - DO NOT invent experience or skills
6. Use action verbs and quantify achievements where possible
7. Tailor the language to match the job posting's tone and requirements

**Output Format:**
Return ONLY a valid JSON object with this exact structure:
{
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
}
