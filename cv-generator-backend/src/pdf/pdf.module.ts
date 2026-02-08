import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PdfService } from './pdf.service';
import { ExternalPdfService } from './external-pdf.service';

@Module({
    imports: [ConfigModule],
    providers: [PdfService, ExternalPdfService],
    exports: [PdfService, ExternalPdfService],
})
export class PdfModule { }
