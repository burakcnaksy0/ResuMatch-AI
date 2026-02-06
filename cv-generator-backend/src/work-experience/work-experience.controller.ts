import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    Query,
} from '@nestjs/common';
import { WorkExperienceService } from './work-experience.service';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';

@Controller('work-experience')
export class WorkExperienceController {
    constructor(private readonly workExperienceService: WorkExperienceService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createWorkExperienceDto: CreateWorkExperienceDto) {
        return this.workExperienceService.create(createWorkExperienceDto);
    }

    @Get()
    findAllByProfile(@Query('profileId') profileId: string) {
        return this.workExperienceService.findAllByProfile(profileId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.workExperienceService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateWorkExperienceDto: UpdateWorkExperienceDto) {
        return this.workExperienceService.update(id, updateWorkExperienceDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.workExperienceService.remove(id);
    }
}
