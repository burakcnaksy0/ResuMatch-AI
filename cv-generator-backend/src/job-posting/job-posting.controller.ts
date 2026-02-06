import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';

@Controller('job-postings')
export class JobPostingController {
    constructor(private readonly jobPostingService: JobPostingService) { }

    @Post()
    create(@Body() createJobPostingDto: CreateJobPostingDto) {
        return this.jobPostingService.create(createJobPostingDto);
    }

    @Get()
    findAll(@Query('userId') userId: string) {
        return this.jobPostingService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('userId') userId: string) {
        return this.jobPostingService.findOne(id, userId);
    }

    @Get(':id/analyze')
    analyzeJobPosting(@Param('id') id: string, @Query('userId') userId: string) {
        return this.jobPostingService.analyzeJobPosting(id, userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Query('userId') userId: string,
        @Body() updateJobPostingDto: UpdateJobPostingDto,
    ) {
        return this.jobPostingService.update(id, userId, updateJobPostingDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Query('userId') userId: string) {
        return this.jobPostingService.remove(id, userId);
    }
}
