import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { Prisma } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class JobPostingService {
    constructor(
        private prisma: PrismaService,
        private aiService: AiService,
        private profileService: ProfileService
    ) { }


    async create(createJobPostingDto: CreateJobPostingDto) {
        // Extract keywords from job description
        const keywords = this.extractKeywords(createJobPostingDto.jobDescription);

        return this.prisma.jobPosting.create({
            data: {
                ...createJobPostingDto,
                requiredSkills: createJobPostingDto.requiredSkills || [],
                keywords,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.jobPosting.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const jobPosting = await this.prisma.jobPosting.findFirst({
            where: { id, userId },
        });

        if (!jobPosting) {
            throw new NotFoundException(`Job posting with ID ${id} not found`);
        }

        return jobPosting;
    }

    async update(
        id: string,
        userId: string,
        updateJobPostingDto: UpdateJobPostingDto,
    ) {
        await this.findOne(id, userId); // Check if exists

        // Re-extract keywords if job description changed
        const keywords = updateJobPostingDto.jobDescription
            ? this.extractKeywords(updateJobPostingDto.jobDescription)
            : undefined;

        return this.prisma.jobPosting.update({
            where: { id },
            data: {
                ...updateJobPostingDto,
                ...(keywords && { keywords }),
            },
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId); // Check if exists
        return this.prisma.jobPosting.delete({
            where: { id },
        });
    }

    /**
     * Extract keywords from job description
     * Simple implementation - can be enhanced with NLP libraries
     */
    private extractKeywords(jobDescription: string): string[] {
        // Common tech skills and keywords
        const techKeywords = [
            'javascript',
            'typescript',
            'python',
            'java',
            'c++',
            'c#',
            'ruby',
            'php',
            'go',
            'rust',
            'react',
            'angular',
            'vue',
            'node',
            'express',
            'nestjs',
            'django',
            'flask',
            'spring',
            'docker',
            'kubernetes',
            'aws',
            'azure',
            'gcp',
            'ci/cd',
            'jenkins',
            'gitlab',
            'mongodb',
            'postgresql',
            'mysql',
            'redis',
            'elasticsearch',
            'git',
            'agile',
            'scrum',
            'rest',
            'graphql',
            'microservices',
            'machine learning',
            'ai',
            'data science',
            'tensorflow',
            'pytorch',
            'html',
            'css',
            'sass',
            'tailwind',
            'bootstrap',
            'sql',
            'nosql',
            'api',
            'testing',
            'jest',
            'mocha',
            'cypress',
        ];

        const lowerDescription = jobDescription.toLowerCase();
        const foundKeywords = new Set<string>();

        // Extract tech keywords
        techKeywords.forEach((keyword) => {
            if (lowerDescription.includes(keyword)) {
                foundKeywords.add(keyword);
            }
        });

        // Extract years of experience
        const yearsMatch = jobDescription.match(/(\d+)\+?\s*years?/gi);
        if (yearsMatch) {
            yearsMatch.forEach((match) => foundKeywords.add(match.toLowerCase()));
        }

        // Extract degree requirements
        const degreeKeywords = ['bachelor', 'master', 'phd', 'degree', 'diploma'];
        degreeKeywords.forEach((keyword) => {
            if (lowerDescription.includes(keyword)) {
                foundKeywords.add(keyword);
            }
        });

        return Array.from(foundKeywords);
    }

    /**
     * Analyze job posting and extract structured information
     */
    async analyzeJobPosting(id: string, userId: string) {
        const jobPosting = await this.findOne(id, userId);

        let profile = null;
        try {
            profile = await this.profileService.findByUserId(userId);
        } catch (error) {
            // Profile might not exist, proceed without comparison
        }

        // Call AI Service
        const analysis = await this.aiService.analyzeJob(jobPosting.jobDescription, profile);

        // Update JobPosting with extracted data
        await this.prisma.jobPosting.update({
            where: { id },
            data: {
                keywords: analysis.keywords || [],
                requiredSkills: [...(analysis.technicalSkills || []), ...(analysis.softSkills || [])],
                experienceLevel: analysis.experienceLevel || 'Not specified',
            },
        });

        return analysis;
    }
}
