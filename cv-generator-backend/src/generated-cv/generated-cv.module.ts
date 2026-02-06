import { Module } from '@nestjs/common';
import { GeneratedCvService } from './generated-cv.service';
import { GeneratedCvController } from './generated-cv.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [PrismaModule, AiModule],
    controllers: [GeneratedCvController],
    providers: [GeneratedCvService],
    exports: [GeneratedCvService],
})
export class GeneratedCvModule { }
