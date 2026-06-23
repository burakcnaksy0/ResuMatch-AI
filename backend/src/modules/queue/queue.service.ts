// src/modules/queue/queue.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';

export interface CvGenerationJobData {
  cvId: string;
  userId: string;
  jobDescriptionId: string;
  templateId: string;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(@InjectQueue('cv-generation') private cvQueue: Queue) {}

  async addCvGenerationJob(data: CvGenerationJobData): Promise<Job> {
    const job = await this.cvQueue.add('generate', data, {
      priority: 1, // High priority
    });

    this.logger.log('CV generation job added to queue', {
      jobId: job.id,
      cvId: data.cvId,
    });

    return job;
  }
}
