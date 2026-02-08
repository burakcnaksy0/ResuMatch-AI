import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    Res,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GeneratedCvService } from './generated-cv.service';
import { ExternalPdfService } from '../pdf/external-pdf.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('generated-cv')
@UseGuards(JwtAuthGuard)
export class GeneratedCvController {
    constructor(
        private readonly generatedCvService: GeneratedCvService,
        private readonly externalPdfService: ExternalPdfService
    ) { }

    // ...

    @Get('test-pdfmonkey')
    async testPdfMonkey() {
        return this.externalPdfService.getTemplates();
    }

    @Get('templates')
    async getTemplates() {
        const localTemplates = [
            { id: 'modern', name: 'Modern (Local)', type: 'local' },
            { id: 'classic', name: 'Classic (Local)', type: 'local' }
        ];

        let externalTemplates = [];
        try {
            const ext = await this.externalPdfService.getTemplates();
            if (ext.document_templates) {
                externalTemplates = ext.document_templates.map(t => ({
                    id: t.id,
                    name: t.name + ' (PDFMonkey)',
                    type: 'external'
                }));
            }
        } catch (e) {
            console.error('Failed to fetch external templates', e);
        }

        return [...localTemplates, ...externalTemplates];
    }

    @Post('upload-photo')
    // ...
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profiles', // Reuse existing folder for simplicity
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `cv-${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    }))
    async uploadPhoto(
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new Error('No file uploaded');
        }

        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Only JPG and PNG files are allowed');
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('File size must be less than 5MB');
        }

        const baseUrl = process.env.BACKEND_URL || 'http://localhost:8080';
        const photoUrl = `${baseUrl}/uploads/profiles/${file.filename}`;

        return { url: photoUrl };
    }

    @Post('generate')
    async generate(
        @Request() req,
        @Body() body: {
            profileId: string;
            jobPostingId: string;
            includeProfilePicture?: boolean;
            tone?: string;
            cvSpecificPhotoUrl?: string;
            templateName?: string;
        },
    ) {
        return this.generatedCvService.generateCV(
            body.profileId,
            body.jobPostingId,
            req.user.userId,
            body.includeProfilePicture,
            body.tone,
            body.cvSpecificPhotoUrl,
            body.templateName,
        );
    }

    @Get()
    findAll(@Request() req) {
        return this.generatedCvService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.generatedCvService.findOne(id, req.user.userId);
    }

    @Post(':id/pdf')
    generatePdf(@Param('id') id: string) {
        // TODO: Ensure ownership check happens here too if needed, or inside service
        return this.generatedCvService.generatePdf(id);
    }

    @Get(':id/download')
    async download(@Param('id') id: string, @Request() req, @Res() res: Response) {
        const filePath = await this.generatedCvService.getPdfPath(id, req.user.userId);
        const absolutePath = require('path').resolve(process.cwd(), filePath);
        res.download(absolutePath);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.generatedCvService.remove(id, req.user.userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Request() req, @Body() body: any) {
        return this.generatedCvService.update(id, req.user.userId, body);
    }
}
