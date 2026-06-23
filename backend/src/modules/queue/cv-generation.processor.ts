// src/modules/queue/cv-generation.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '@prisma-service/prisma.service';
import { AiService } from '../ai/ai.service';
import { ProfileService } from '../profile/profile.service';
import { CvGenerationJobData } from './queue.service';

@Processor('cv-generation', {
  concurrency: 5, // Concurrent AI generations limit
})
export class CvGenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(CvGenerationProcessor.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private profileService: ProfileService,
  ) {
    super();
  }

  async process(job: Job<CvGenerationJobData>): Promise<void> {
    const { cvId, userId, jobDescriptionId } = job.data;
    this.logger.log(`Processing CV generation job ${job.id}`, { cvId });

    // 1. Update Status -> PROCESSING
    await this.prisma.generatedCV.update({
      where: { id: cvId },
      data: { status: 'PROCESSING' },
    });

    try {
      // 2. Parallel Fetch: Profile and Job Description
      const [profile, jobDescription] = await Promise.all([
        this.profileService.findByUserId(userId),
        this.prisma.jobDescription.findFirst({
          where: { id: jobDescriptionId, userId },
        }),
      ]);

      if (!profile || !jobDescription) {
        throw new Error('Gerekli profil veya iş ilanı verisi bulunamadı');
      }

      // 3. Call AI Service (OpenRouter/GPT-4o)
      const cvData = await this.aiService.generateCV(profile, jobDescription);

      // 4. Update Status -> COMPLETED
      await this.prisma.generatedCV.update({
        where: { id: cvId },
        data: {
          status: 'COMPLETED',
          cvData: cvData as any,
          aiModel: 'Qwen/Qwen2.5-14B-Instruct:featherless-ai',
          // Note: Token and cost metadata could be added here if returned by AiService
        },
      });

      this.logger.log(`CV generation completed successfully`, { cvId });
    } catch (error) {
      this.logger.error(`CV generation failed`, {
        cvId,
        error: error.message,
        attempt: job.attemptsMade,
      });

      // Update failure info in DB
      await this.prisma.generatedCV.update({
        where: { id: cvId },
        data: {
          retryCount: { increment: 1 },
          errorMessage: error.message,
          // If this was the last attempt, mark as FAILED
          ...(job.attemptsMade >= 2 && { status: 'FAILED' }),
        },
      });

      // Throw error to trigger BullMQ retry mechanism
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} permanently failed`, {
      error: error.message,
      attempts: job.attemptsMade,
    });
  }
}
