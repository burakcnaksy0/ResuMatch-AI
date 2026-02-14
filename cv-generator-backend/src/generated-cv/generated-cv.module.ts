import { Module } from '@nestjs/common';
import { GeneratedCvService } from './generated-cv.service';
import { GeneratedCvController } from './generated-cv.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { PdfModule } from '../pdf/pdf.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
    imports: [PrismaModule, AiModule, PdfModule, SubscriptionModule],
    controllers: [GeneratedCvController],
    providers: [GeneratedCvService],
    exports: [GeneratedCvService],
})
export class GeneratedCvModule { }
