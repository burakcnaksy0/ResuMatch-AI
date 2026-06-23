// src/modules/cv/cv.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { PrismaService } from '@prisma-service/prisma.service';
import { GeneratedCV, Prisma } from '@prisma/client';
import { GenerateCvDto } from './dto/generate-cv.dto';
import { QueueService } from '../queue/queue.service';
import { RateLimitException } from '@common/exceptions/base.exception';

@Injectable()
export class CvService {
  private readonly logger = new Logger(CvService.name);

  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
    private config: ConfigService,
    @InjectRedis() private redis: Redis,
  ) {}

  async initGeneration(userId: string, dto: GenerateCvDto) {
    // 1. Hourly Rate Limit Check
    const limit = this.config.get<number>('app.maxCvGenerationsPerHour') || 5;
    const rateLimitKey = `rate:cv:${userId}:hour`;

    const count = await this.redis.incr(rateLimitKey);
    if (count === 1) {
      await this.redis.expire(rateLimitKey, 3600); // 1 hour
    }

    if (count > limit) {
      throw new RateLimitException();
    }

    // 2. Verified Job Description belongs to user
    const jd = await this.prisma.jobDescription.findFirst({
      where: { id: dto.jobDescriptionId, userId },
    });
    if (!jd) throw new NotFoundException('İş ilanı bulunamadı');

    // 3. Create Pending Record
    const cv = await this.prisma.generatedCV.create({
      data: {
        userId,
        jobDescriptionId: dto.jobDescriptionId,
        templateId: dto.templateId,
        status: 'PENDING',
        includePhoto: dto.includePhoto ?? true,
      },
    });

    // 4. Dispatch Job
    const job = await this.queueService.addCvGenerationJob({
      cvId: cv.id,
      userId,
      jobDescriptionId: dto.jobDescriptionId,
      templateId: dto.templateId,
    });

    return {
      cvId: cv.id,
      jobId: job.id,
      status: 'PENDING',
      estimatedSeconds: 45, // updated estimate for HuggingFace model
    };
  }

  async findAll(userId: string): Promise<GeneratedCV[]> {
    return this.prisma.generatedCV.findMany({
      where: { userId, deletedAt: null },
      include: { jobDescription: { select: { title: true, company: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string): Promise<GeneratedCV> {
    const cv = await this.prisma.generatedCV.findFirst({
      where: { id, userId, deletedAt: null },
      include: { jobDescription: true },
    });

    if (!cv) throw new NotFoundException('CV bulunamadı');
    return cv;
  }

  async updateEditedData(
    userId: string,
    id: string,
    editedData: any,
  ): Promise<GeneratedCV> {
    const cv = await this.findOne(userId, id); // check ownership

    return this.prisma.generatedCV.update({
      where: { id: cv.id },
      data: { editedData: editedData as unknown as Prisma.InputJsonValue },
    });
  }

  async softDelete(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id); // check ownership

    await this.prisma.generatedCV.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStatus(userId: string, id: string) {
    const cv = await this.prisma.generatedCV.findFirst({
      where: { id, userId },
      select: { id: true, status: true, errorMessage: true },
    });

    if (!cv) throw new NotFoundException('CV bulunamadı');

    return {
      cvId: cv.id,
      status: cv.status,
      error: cv.errorMessage,
      // Status message calculation if needed
    };
  }
}
