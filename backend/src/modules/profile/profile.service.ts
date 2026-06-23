// src/modules/profile/profile.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma-service/prisma.service';
import { Profile, Prisma } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    // We use upsert logic here so that a profile record is created if missing,
    // or updated if it already exists for the given user.
    return this.prisma.profile.upsert({
      where: { userId },
      update: {
        ...dto,
        // Prisma handling of JSON: it merges or replaces based on structure
        experiences: dto.experiences as unknown as Prisma.InputJsonValue,
        educations: dto.educations as unknown as Prisma.InputJsonValue,
        skills: dto.skills as unknown as Prisma.InputJsonValue,
        certifications: dto.certifications as unknown as Prisma.InputJsonValue,
        languages: dto.languages as unknown as Prisma.InputJsonValue,
        projects: dto.projects as unknown as Prisma.InputJsonValue,
      },
      create: {
        userId,
        ...dto,
        experiences: (dto.experiences ??
          []) as unknown as Prisma.InputJsonValue,
        educations: (dto.educations ?? []) as unknown as Prisma.InputJsonValue,
        skills: (dto.skills ?? []) as unknown as Prisma.InputJsonValue,
        certifications: (dto.certifications ??
          []) as unknown as Prisma.InputJsonValue,
        languages: (dto.languages ?? []) as unknown as Prisma.InputJsonValue,
        projects: (dto.projects ?? []) as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async updateSection(
    userId: string,
    section: string,
    data: any[],
  ): Promise<Profile> {
    // Partial update of only a specific JSON array/section
    return this.prisma.profile.update({
      where: { userId },
      data: {
        [section]: data as unknown as Prisma.InputJsonValue,
      },
    });
  }
}
