// src/modules/profile/profile.controller.ts
import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { Profile } from '@prisma/client';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserResponseDto } from '../user/dto/user-response.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@CurrentUser() user: UserResponseDto): Promise<Profile> {
    const profile = await this.profileService.findByUserId(user.id);
    if (!profile) {
      // Return empty JSON structure for the frontend if profile is missing
      return {
        id: '',
        userId: user.id,
        headline: '',
        summary: '',
        location: '',
        phone: '',
        website: '',
        linkedin: '',
        github: '',
        photo: null,
        experiences: [],
        educations: [],
        skills: [],
        certifications: [],
        languages: [],
        projects: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Profile;
    }
    return profile;
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updateFullProfile(
    @CurrentUser() user: UserResponseDto,
    @Body() dto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profileService.update(user.id, dto);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updatePartialProfile(
    @CurrentUser() user: UserResponseDto,
    @Body() dto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profileService.update(user.id, dto);
  }
}
