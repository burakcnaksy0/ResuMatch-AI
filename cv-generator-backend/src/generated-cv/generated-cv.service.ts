import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { PdfService } from '../pdf/pdf.service';
import { ExternalPdfService } from '../pdf/external-pdf.service';
import { CvData } from '../pdf/pdf.service';
import { SubscriptionService, CVType } from '../subscription/subscription.service';

@Injectable()
export class GeneratedCvService {
    constructor(
        private prisma: PrismaService,
        private aiService: AiService,
        private pdfService: PdfService,
        private externalPdfService: ExternalPdfService,
        private subscriptionService: SubscriptionService,
    ) { }

    async generateCV(
        profileId: string,
        jobPostingId: string | undefined | null,
        userId: string,
        includeProfilePicture: boolean = false,
        tone: string = 'Professional',
        cvSpecificPhotoUrl?: string,
        templateName: string = 'modern',
        contentLanguage: string = 'English',
    ) {
        // Determine CV type
        const cvType = jobPostingId ? CVType.JOB_BASED : CVType.PROFILE_BASED;

        // Check subscription limits
        const canGenerate = await this.subscriptionService.canGenerateCV(userId, cvType);
        if (!canGenerate) {
            const subscription = await this.subscriptionService.getSubscriptionStatus(userId);
            const limit = cvType === CVType.JOB_BASED
                ? subscription.usage.jobBasedCVs.limit
                : subscription.usage.profileBasedCVs.limit;

            throw new ForbiddenException(
                `You have reached your ${cvType === CVType.JOB_BASED ? 'job-based' : 'profile-based'} CV generation limit (${limit}). Upgrade to Pro for unlimited CV generation.`
            );
        }

        // Verify profile belongs to user
        const profile = await this.prisma.profile.findFirst({
            where: { id: profileId, userId },
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        // Verify job posting belongs to user if provided
        if (jobPostingId) {
            const jobPosting = await this.prisma.jobPosting.findFirst({
                where: { id: jobPostingId, userId },
            });

            if (!jobPosting) {
                throw new NotFoundException('Job posting not found');
            }
        }

        // Create pending CV record
        const generatedCV = await this.prisma.generatedCV.create({
            data: {
                userId,
                profileId,
                jobPostingId: jobPostingId || null,
                generationStatus: 'pending',
                aiModelUsed: 'openai/gpt-4o-2024-11-20',
                includeProfilePicture,
                cvSpecificPhotoUrl,
                tone,
                templateName,
                cvType,
            },
        });

        try {
            // Generate CV content using AI
            const content = await this.aiService.generateCV({
                profileId,
                jobPostingId: jobPostingId || undefined,
                tone,
                language: contentLanguage,
            });

            // Update CV with generated content
            // Need to update the type of GeneratedCVContent to allow 'any' because it comes from AI service and might have slight variations
            // Or just cast it as any to satisfy the prisma input type which expects Json
            const updatedCV = await this.prisma.generatedCV.update({
                where: { id: generatedCV.id },
                data: {
                    generatedContent: content as any,
                    professionalSummary: content.professionalSummary, // Also save summary separately
                    generationStatus: 'completed',
                },
                include: {
                    profile: true,
                    jobPosting: true,
                },
            });

            // Increment usage counter for free users
            await this.subscriptionService.incrementCVUsage(userId, cvType);

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
            skillGroups: (content.skills || []).reduce((acc: any[], skill: any) => {
                const category = skill.category || 'Other';
                const existing = acc.find((g: any) => g.category === category);
                if (existing) {
                    existing.skills.push(skill);
                } else {
                    acc.push({ category: category, skills: [skill] });
                }
                return acc;
            }, []),
            projects: content.projects,

            profilePictureUrl: cv.cvSpecificPhotoUrl || (cv.includeProfilePicture ? (cv.profile?.profilePictureUrl || undefined) : undefined),
        };

        const outputFilename = `cv-${cv.id}.pdf`;
        let relativePath = '';
        // All templates are now handled locally via HTML/CSS templates
        const templateName = (cv as any).templateName || 'modern';
        relativePath = await this.pdfService.generatePdf(templateData, outputFilename, templateName);

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

    async update(id: string, userId: string, updateData: any) {
        const cv = await this.findOne(id, userId);

        const dataToUpdate = { ...updateData };

        // If updating professionalSummary, also update it inside generatedContent JSON
        if (updateData.professionalSummary && cv.generatedContent) {
            const currentContent = cv.generatedContent as any;
            dataToUpdate.generatedContent = {
                ...currentContent,
                professionalSummary: updateData.professionalSummary,
            };
        }

        return this.prisma.generatedCV.update({
            where: { id: cv.id },
            data: dataToUpdate,
        });
    }

    async remove(id: string, userId: string) {
        const cv = await this.findOne(id, userId);
        return this.prisma.generatedCV.delete({
            where: { id: cv.id },
        });
    }
}
