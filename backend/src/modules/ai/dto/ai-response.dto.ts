// src/modules/ai/dto/ai-response.dto.ts
import { z } from 'zod';

export const CvDataSchema = z.object({
  summary: z.string(),
  experiences: z
    .array(
      z.object({
        id: z.string().optional().default('gen-id'),
        company: z.string().optional().default(''),
        title: z.string().optional().default(''),
        startDate: z.string().optional().default(''),
        endDate: z.string().nullable().optional(),
        isCurrent: z.boolean().optional().default(false),
        location: z.string().optional().default(''),
        bullets: z.array(z.string()).optional().default([]),
        relevanceScore: z.number().optional().default(5),
      }),
    )
    .optional()
    .default([]),
  educations: z
    .array(
      z.object({
        id: z.string().optional().default('gen-id'),
        institution: z.string().optional().default(''),
        degree: z.string().optional().default(''),
        field: z.string().optional().default(''),
        startDate: z.string().optional().default(''),
        endDate: z.string().nullable().optional(),
        gpa: z.string().nullable().optional(),
        highlights: z.array(z.string()).optional().default([]),
      }),
    )
    .optional()
    .default([]),
  skills: z
    .union([
      // Backward compatibility with old format
      z.object({
        technical: z.array(z.string()).optional().default([]),
        soft: z.array(z.string()).optional().default([]),
        tools: z.array(z.string()).optional().default([]),
      }),
      // New format
      z.array(
        z.object({
          category: z.string(),
          items: z.array(z.string()),
        }),
      ),
    ])
    .optional()
    .default([]),
  certifications: z
    .array(
      z.object({
        id: z.string().optional().default(''),
        name: z.string(),
        issuer: z.string().optional().default(''),
        date: z.string().optional().default(''),
        expiryDate: z.string().nullable().optional(),
        url: z.string().nullable().optional(),
      }),
    )
    .optional()
    .default([]),
  languages: z
    .array(
      z.object({
        language: z.string(),
        level: z.string(),
      }),
    )
    .optional()
    .default([]),
  projects: z
    .array(
      z.object({
        id: z.string().optional().default(''),
        name: z.string(),
        description: z.string(),
        url: z.string().nullable().optional(),
        technologies: z.array(z.string()).optional().default([]),
      }),
    )
    .optional()
    .default([]),
  metadata: z.object({
    targetJobTitle: z.string(),
    atsKeywordsIncorporated: z
      .array(
        z.object({
          keyword: z.string(),
          tier: z.string().optional(),
          placedIn: z.array(z.string()).optional(),
        }),
      )
      .optional()
      .default([]),
    overallMatchScore: z.number(),
    missingKeyRequirements: z
      .array(
        z.object({
          requirement: z.string(),
          tier: z.string().optional(),
          type: z.string().optional(),
        }),
      )
      .optional()
      .default([]),
  }),
  atsAnalysis: z
    .object({
      hardSkillMatches: z
        .array(
          z.object({
            keyword: z.string(),
            tier: z.string().optional(),
            foundInSection: z.string(),
            frequency: z.number(),
          }),
        )
        .optional()
        .default([]),
      hardSkillGaps: z
        .array(
          z.object({
            skill: z.string(),
            tier: z.string().optional(),
          }),
        )
        .optional()
        .default([]),
      softSkillMatches: z.array(z.string()).optional().default([]),
      industryKeywords: z.array(z.string()).optional().default([]),
      actionVerbsUsed: z.array(z.string()).optional().default([]),
      keywordDensityScore: z.number().optional().default(0),
      sectionCompletenessScore: z.number().optional().default(0),
      formattingScore: z.number().optional().default(0),
      overallReadabilityScore: z.number().optional().default(0),
      improvementTips: z
        .array(
          z.object({
            priority: z.string().optional(),
            section: z.string().optional(),
            tip: z.string(),
          }),
        )
        .optional()
        .default([]),
    })
    .optional()
    .default({
      hardSkillMatches: [],
      hardSkillGaps: [],
      softSkillMatches: [],
      industryKeywords: [],
      actionVerbsUsed: [],
      keywordDensityScore: 0,
      sectionCompletenessScore: 0,
      formattingScore: 0,
      overallReadabilityScore: 0,
      improvementTips: [],
    }),
});

export type CvData = z.infer<typeof CvDataSchema>;
