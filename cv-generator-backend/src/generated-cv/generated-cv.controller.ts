import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    Res,
    UseGuards,
    Request,
} from '@nestjs/common';
import type { Response } from 'express';
import { GeneratedCvService } from './generated-cv.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('generated-cv')
@UseGuards(JwtAuthGuard)
export class GeneratedCvController {
    constructor(private readonly generatedCvService: GeneratedCvService) { }

    @Post('generate')
    async generate(
        @Request() req,
        @Body() body: { profileId: string; jobPostingId: string },
    ) {
        return this.generatedCvService.generateCV(
            body.profileId,
            body.jobPostingId,
            req.user.userId,
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
}
