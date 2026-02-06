import { Module } from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { JobPostingController } from './job-posting.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [JobPostingController],
    providers: [JobPostingService],
    exports: [JobPostingService],
})
export class JobPostingModule { }
