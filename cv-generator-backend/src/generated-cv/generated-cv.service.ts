import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { PdfService } from '../pdf/pdf.service';

@Injectable()
export class GeneratedCvService {
    constructor(
        private prisma: PrismaService,
        private aiService: AiService,
        private pdfService: PdfService,
    ) { }

    async generateCV(profileId: string, jobPostingId: string, userId: string) {
        // Verify profile belongs to user
        const profile = await this.prisma.profile.findFirst({
            where: { id: profileId, userId },
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        // Verify job posting belongs to user
        const jobPosting = await this.prisma.jobPosting.findFirst({
            where: { id: jobPostingId, userId },
        });

        if (!jobPosting) {
            throw new NotFoundException('Job posting not found');
        }

        // Create pending CV record
        const generatedCV = await this.prisma.generatedCV.create({
            data: {
                userId,
                profileId,
                jobPostingId,
                generationStatus: 'pending',
                aiModelUsed: 'openai/gpt-4o-2024-11-20',
            },
        });

        try {
            // Generate CV content using AI
            const content = await this.aiService.generateCV({
                profileId,
                jobPostingId,
            });

            // Update CV with generated content
            const updatedCV = await this.prisma.generatedCV.update({
                where: { id: generatedCV.id },
                data: {
                    generatedContent: content as any,
                    generationStatus: 'completed',
                },
                include: {
                    profile: true,
                    jobPosting: true,
                },
            });

            return updatedCV;
        } catch (error) {
            // Mark as failed
            await this.prisma.generatedCV.update({
                where: { id: generatedCV.id },
                data: {
                    generationStatus: 'failed',
                },
            });

            throw error;
        }
    }

    async findAll(userId: string) {
        return this.prisma.generatedCV.findMany({
            where: { userId },
            include: {
                profile: {
                    select: {
                        fullName: true,
                    },
                },
                jobPosting: {
                    select: {
                        jobTitle: true,
                        company: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const cv = await this.prisma.generatedCV.findFirst({
            where: { id, userId },
            include: {
                profile: true,
                jobPosting: true,
            },
        });

        if (!cv) {
            throw new NotFoundException(`Generated CV with ID ${id} not found`);
        }

        return cv;
    }

    async generatePdf(id: string) {
        const cv = await this.prisma.generatedCV.findUnique({
            where: { id },
            include: {
                profile: true,
                jobPosting: true,
            },
        });

        if (!cv || !cv.generatedContent) {
            throw new Error('CV not found or content not generated');
        }

        const content = cv.generatedContent as any;

        const templateData = {
            fullName: cv.profile?.fullName || 'Candidate',
            htmlTitle: cv.jobPosting?.jobTitle || 'CV',
            jobTitle: cv.jobPosting?.jobTitle || 'Position',
            company: cv.jobPosting?.company || 'Company',
            generationDate: new Date(cv.createdAt).toLocaleDateString(),
            professionalSummary: content.professionalSummary,
            workExperience: content.workExperience,
            education: content.education,
            skills: content.skills,
            projects: content.projects,
        };

        const outputFilename = `cv-${cv.id}.pdf`;
        const relativePath = await this.pdfService.generatePdf(templateData, outputFilename);

        const pdfUrl = `http://localhost:8080/api/generated-cv/${id}/download?userId=${cv.userId}`;
        await this.prisma.generatedCV.update({
            where: { id },
            data: {
                pdfUrl,
                pdfStoragePath: relativePath,
            },
        });

        return { url: pdfUrl };
    }

    async getPdfPath(id: string, userId: string) {
        const cv = await this.findOne(id, userId);
        if (!cv.pdfStoragePath) {
            throw new NotFoundException('PDF not yet generated');
        }
        // Assuming relativePath is from project root
        return cv.pdfStoragePath;
    }

    async remove(id: string, userId: string) {
        const cv = await this.findOne(id, userId);
        return this.prisma.generatedCV.delete({
            where: { id: cv.id },
        });
    }
}
