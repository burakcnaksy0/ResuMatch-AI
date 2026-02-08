import { z } from 'zod';

export const jobPostingSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    jobTitle: z.string().min(2, 'Job title is required'),
    company: z.string().optional(),
    jobUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    jobDescription: z.string().min(10, 'Job description must be at least 10 characters'),
    requiredSkills: z.array(z.string()).optional(),
    experienceLevel: z.string().optional(),
});

export type JobPostingFormData = z.infer<typeof jobPostingSchema>;
