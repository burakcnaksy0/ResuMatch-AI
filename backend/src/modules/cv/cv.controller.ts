// src/modules/cv/cv.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { GenerateCvDto } from './dto/generate-cv.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { GeneratedCV } from '@prisma/client';

@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('generate')
  @HttpCode(HttpStatus.ACCEPTED) // 202 - Generation started
  async generateCv(
    @CurrentUser() user: UserResponseDto,
    @Body() dto: GenerateCvDto,
  ) {
    return this.cvService.initGeneration(user.id, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: UserResponseDto): Promise<GeneratedCV[]> {
    return this.cvService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
  ): Promise<GeneratedCV> {
    return this.cvService.findOne(user.id, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
    @Body('editedData') editedData: any, // for manual overrides
  ): Promise<GeneratedCV> {
    return this.cvService.updateEditedData(user.id, id, editedData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
  ): Promise<void> {
    return this.cvService.softDelete(user.id, id);
  }

  @Get(':id/status')
  async getStatus(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
  ) {
    return this.cvService.getStatus(user.id, id);
  }
}
