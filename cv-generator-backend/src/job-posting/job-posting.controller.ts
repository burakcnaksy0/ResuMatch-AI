import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('job-postings')
@UseGuards(JwtAuthGuard)
export class JobPostingController {
    constructor(private readonly jobPostingService: JobPostingService) { }

    @Post()
    create(@Request() req, @Body() createJobPostingDto: CreateJobPostingDto) {
        createJobPostingDto.userId = req.user.userId;
        return this.jobPostingService.create(createJobPostingDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.jobPostingService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.jobPostingService.findOne(id, req.user.userId);
    }

    @Get(':id/analyze')
    analyzeJobPosting(@Param('id') id: string, @Request() req) {
        return this.jobPostingService.analyzeJobPosting(id, req.user.userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Request() req,
        @Body() updateJobPostingDto: UpdateJobPostingDto,
    ) {
        return this.jobPostingService.update(id, req.user.userId, updateJobPostingDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.jobPostingService.remove(id, req.user.userId);
    }
}
