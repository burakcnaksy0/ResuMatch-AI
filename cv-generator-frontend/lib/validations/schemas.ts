import { z } from 'zod';

// Profile Schema
export const profileSchema = z.object({
    userId: z.string().optional(),
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100).optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    portfolioUrl: z.string().url('Invalid Portfolio URL').optional().or(z.literal('')),
    professionalSummary: z.string().optional(),
    profilePictureUrl: z.string().optional(),
});

// Education Schema
export const educationSchema = z.object({
    profileId: z.string().min(1, 'Profile ID is required'),
    institution: z.string().min(2, 'Institution name is required'),
    degree: z.string().min(2, 'Degree is required'),
    fieldOfStudy: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    gpa: z.number().min(0).max(4).optional(),
    description: z.string().optional(),
});

// Work Experience Schema
export const workExperienceSchema = z.object({
    profileId: z.string().min(1, 'Profile ID is required'),
    company: z.string().min(2, 'Company name is required'),
    position: z.string().min(2, 'Position is required'),
    location: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    description: z.string().optional(),
    achievements: z.array(z.string()),
});

// Skill Schema
export const skillSchema = z.object({
    profileId: z.string().min(1, 'Profile ID is required'),
    name: z.string().min(1, 'Skill name is required'),
    category: z.string().optional(),
    proficiencyLevel: z.string().optional(),
});

// Project Schema
export const projectSchema = z.object({
    profileId: z.string().min(1, 'Profile ID is required'),
    name: z.string().min(2, 'Project name is required'),
    description: z.string().optional(),
    technologies: z.array(z.string()),
    url: z.string().url('Invalid URL').optional().or(z.literal('')),
    githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

// Certification Schema
export const certificationSchema = z.object({
    profileId: z.string().min(1, 'Profile ID is required'),
    name: z.string().min(2, 'Certification name is required'),
    issuer: z.string().min(2, 'Issuer is required'),
    issueDate: z.string().min(1, 'Issue date is required'),
    expiryDate: z.string().optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

// Language Schema
export const languageSchema = z.object({
    profileId: z.string().min(1, 'Profile ID is required'),
    name: z.string().min(2, 'Language name is required'),
    proficiency: z.string().optional(),
});

// Type inference
export type ProfileFormData = z.infer<typeof profileSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type LanguageFormData = z.infer<typeof languageSchema>;
