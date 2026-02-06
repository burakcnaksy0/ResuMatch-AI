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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto);
    }

    @Get()
    findAllByProfile(@Query('profileId') profileId: string) {
        return this.projectService.findAllByProfile(profileId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectService.update(id, updateProjectDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.projectService.remove(id);
    }
}
