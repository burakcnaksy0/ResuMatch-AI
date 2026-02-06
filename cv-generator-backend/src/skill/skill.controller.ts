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
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skill')
export class SkillController {
    constructor(private readonly skillService: SkillService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createSkillDto: CreateSkillDto) {
        return this.skillService.create(createSkillDto);
    }

    @Get()
    findAllByProfile(@Query('profileId') profileId: string) {
        return this.skillService.findAllByProfile(profileId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.skillService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
        return this.skillService.update(id, updateSkillDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.skillService.remove(id);
    }
}
