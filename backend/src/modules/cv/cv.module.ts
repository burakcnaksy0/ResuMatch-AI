// src/modules/cv/cv.module.ts
import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [CvService],
  controllers: [CvController],
  exports: [CvService],
})
export class CvModule {}
