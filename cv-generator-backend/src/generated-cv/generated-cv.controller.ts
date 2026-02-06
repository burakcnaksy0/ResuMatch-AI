import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import { GeneratedCvService } from './generated-cv.service';

@Controller('generated-cv')
export class GeneratedCvController {
    constructor(private readonly generatedCvService: GeneratedCvService) { }

    @Post('generate')
    async generate(
        @Body() body: { profileId: string; jobPostingId: string; userId: string },
    ) {
        return this.generatedCvService.generateCV(
            body.profileId,
            body.jobPostingId,
            body.userId,
        );
    }

    @Get()
    findAll(@Query('userId') userId: string) {
        return this.generatedCvService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('userId') userId: string) {
        return this.generatedCvService.findOne(id, userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Query('userId') userId: string) {
        return this.generatedCvService.remove(id, userId);
    }
}
