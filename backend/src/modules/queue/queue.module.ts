// src/modules/queue/queue.module.ts
import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { CvGenerationProcessor } from './cv-generation.processor';
import { AiModule } from '../ai/ai.module';
import { UserModule } from '../user/user.module';
import { ProfileModule } from '../profile/profile.module';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cv-generation',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000, // 5s -> 10s -> 20s
        },
        removeOnComplete: {
          count: 100, // keep last 100
          age: 24 * 3600, // or 24h
        },
        removeOnFail: {
          count: 50,
        },
      },
    }),
    AiModule,
    UserModule,
    ProfileModule,
  ],
  providers: [QueueService, CvGenerationProcessor],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
