import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
    constructor(private prisma: PrismaService) { }

    async create(createEducationDto: CreateEducationDto) {
        return this.prisma.education.create({
            data: {
                ...createEducationDto,
                startDate: new Date(createEducationDto.startDate),
                endDate: createEducationDto.endDate ? new Date(createEducationDto.endDate) : null,
            },
        });
    }

    async findAllByProfile(profileId: string) {
        return this.prisma.education.findMany({
            where: { profileId },
            orderBy: { startDate: 'desc' },
        });
    }

    async findOne(id: string) {
        const education = await this.prisma.education.findUnique({
            where: { id },
        });

        if (!education) {
            throw new NotFoundException(`Education with ID ${id} not found`);
        }

        return education;
    }

    async update(id: string, updateEducationDto: UpdateEducationDto) {
        await this.findOne(id);

        return this.prisma.education.update({
            where: { id },
            data: {
                ...updateEducationDto,
                startDate: updateEducationDto.startDate ? new Date(updateEducationDto.startDate) : undefined,
                endDate: updateEducationDto.endDate ? new Date(updateEducationDto.endDate) : undefined,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.education.delete({
            where: { id },
        });
    }
}
