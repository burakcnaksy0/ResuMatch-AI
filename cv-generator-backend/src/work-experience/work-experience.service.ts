import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';

@Injectable()
export class WorkExperienceService {
  constructor(private prisma: PrismaService) {}

  async create(createWorkExperienceDto: CreateWorkExperienceDto) {
    return this.prisma.workExperience.create({
      data: {
        ...createWorkExperienceDto,
        startDate: new Date(createWorkExperienceDto.startDate),
        endDate: createWorkExperienceDto.endDate
          ? new Date(createWorkExperienceDto.endDate)
          : null,
      },
    });
  }

  async findAllByProfile(profileId: string) {
    return this.prisma.workExperience.findMany({
      where: { profileId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const workExperience = await this.prisma.workExperience.findUnique({
      where: { id },
    });

    if (!workExperience) {
      throw new NotFoundException(`Work experience with ID ${id} not found`);
    }

    return workExperience;
  }

  async update(id: string, updateWorkExperienceDto: UpdateWorkExperienceDto) {
    await this.findOne(id);

    return this.prisma.workExperience.update({
      where: { id },
      data: {
        ...updateWorkExperienceDto,
        startDate: updateWorkExperienceDto.startDate
          ? new Date(updateWorkExperienceDto.startDate)
          : undefined,
        endDate: updateWorkExperienceDto.endDate
          ? new Date(updateWorkExperienceDto.endDate)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.workExperience.delete({
      where: { id },
    });
  }
}
