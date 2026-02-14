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
    async getTemplates(@Request() req) {
        // Define all available templates with metadata
        const allTemplates = [
            {
                id: 'classic',
                name: 'Classic',
                category: 'Professional',
                description: 'Traditional single-column layout. Perfect for corporate positions and ATS systems.',
                isPro: false,
                layout: 'single-column',
                colorScheme: 'monochrome',
                features: ['ATS Optimized', 'Clean Layout', 'Professional'],
                preview: '/templates/classic-preview.png',
                bestFor: ['Corporate', 'Finance', 'Legal', 'Government']
            },
            {
                id: 'modern',
                name: 'Modern (Local)',
                category: 'Creative',
                description: 'Two-column design with sidebar. Ideal for tech and startup positions.',
                isPro: false,
                type: 'local',
                layout: 'two-column',
                colorScheme: 'colorful',
                features: ['Visual Appeal', 'Sidebar Layout', 'Tech-Friendly'],
                preview: '/templates/modern-preview.png',
                bestFor: ['Technology', 'Startups', 'Creative Roles']
            },
            {
                id: 'professional',
                name: 'Professional',
                category: 'Business',
                description: 'Balanced design with subtle colors. Great for mid-senior level positions.',
                isPro: true,
                layout: 'hybrid',
                colorScheme: 'subtle-color',
                features: ['Premium Design', 'Balanced Layout', 'Modern Professional'],
                preview: '/templates/professional-preview.png',
                bestFor: ['Management', 'Consulting', 'Business Development']
            },
            {
                id: 'creative',
                name: 'Creative',
                category: 'Design',
                description: 'Bold and distinctive design. Perfect for creative and design roles.',
                isPro: true,
                layout: 'creative',
                colorScheme: 'vibrant',
                features: ['Eye-Catching', 'Creative Layout', 'Portfolio Style'],
                preview: '/templates/creative-preview.png',
                bestFor: ['Design', 'Marketing', 'Arts', 'Media']
            },
            {
                id: 'executive',
                name: 'Executive',
                category: 'Leadership',
                description: 'Premium executive template with sophisticated design.',
                isPro: true,
                layout: 'executive',
                colorScheme: 'elegant',
                features: ['Executive Style', 'Premium Feel', 'Leadership Focused'],
                preview: '/templates/executive-preview.png',
                bestFor: ['C-Level', 'Executive', 'Senior Leadership']
            },
            {
                id: 'minimal',
                name: 'Minimal',
                category: 'Simple',
                description: 'Ultra-clean minimalist design. Maximum readability.',
                isPro: true,
                layout: 'minimal',
                colorScheme: 'minimal',
                features: ['Ultra Clean', 'Maximum Readability', 'Minimal Design'],
                preview: '/templates/minimal-preview.png',
                bestFor: ['Academic', 'Research', 'Technical Writing']
            }
        ];

        return {
            templates: allTemplates,
            userHasProAccess: false // Handled by frontend context
        };
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
