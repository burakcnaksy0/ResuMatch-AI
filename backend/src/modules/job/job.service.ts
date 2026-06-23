// src/modules/job/job.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma-service/prisma.service';
import { JobDescription } from '@prisma/client';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateJobDto): Promise<JobDescription> {
    return this.prisma.jobDescription.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string): Promise<JobDescription[]> {
    return this.prisma.jobDescription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string): Promise<JobDescription> {
    const job = await this.prisma.jobDescription.findFirst({
      where: { id, userId },
    });

    if (!job) {
      throw new NotFoundException('İş ilanı bulunamadı');
    }

    return job;
  }

  async remove(userId: string, id: string): Promise<void> {
    // Verify ownership before deleting
    const job = await this.prisma.jobDescription.findFirst({
      where: { id, userId },
    });

    if (!job) {
      throw new NotFoundException('İş ilanı bulunamadı veya yetkiniz yok');
    }

    // DB cascade (onDelete: Cascade) will automatically delete linked GeneratedCVs
    await this.prisma.jobDescription.delete({ where: { id } });
  }
}
