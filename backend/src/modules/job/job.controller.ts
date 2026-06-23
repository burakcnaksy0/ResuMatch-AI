// src/modules/job/job.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { JobDescription } from '@prisma/client';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: UserResponseDto,
    @Body() dto: CreateJobDto,
  ): Promise<JobDescription> {
    return this.jobService.create(user.id, dto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: UserResponseDto,
  ): Promise<JobDescription[]> {
    return this.jobService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
  ): Promise<JobDescription> {
    return this.jobService.findOne(user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
  ): Promise<void> {
    return this.jobService.remove(user.id, id);
  }
}
