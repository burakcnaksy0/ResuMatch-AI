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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Controller('education')
export class EducationController {
    constructor(private readonly educationService: EducationService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createEducationDto: CreateEducationDto) {
        return this.educationService.create(createEducationDto);
    }

    @Get()
    findAllByProfile(@Query('profileId') profileId: string) {
        return this.educationService.findAllByProfile(profileId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.educationService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateEducationDto: UpdateEducationDto) {
        return this.educationService.update(id, updateEducationDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.educationService.remove(id);
    }
}
