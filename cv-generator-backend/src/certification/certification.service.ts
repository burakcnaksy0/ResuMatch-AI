import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';

@Injectable()
export class CertificationService {
    constructor(private prisma: PrismaService) { }

    async create(createCertificationDto: CreateCertificationDto) {
        return this.prisma.certification.create({
            data: {
                ...createCertificationDto,
                issueDate: new Date(createCertificationDto.issueDate),
                expiryDate: createCertificationDto.expiryDate ? new Date(createCertificationDto.expiryDate) : null,
            },
        });
    }

    async findAllByProfile(profileId: string) {
        return this.prisma.certification.findMany({
            where: { profileId },
            orderBy: { issueDate: 'desc' },
        });
    }

    async findOne(id: string) {
        const certification = await this.prisma.certification.findUnique({
            where: { id },
        });

        if (!certification) {
            throw new NotFoundException(`Certification with ID ${id} not found`);
        }

        return certification;
    }

    async update(id: string, updateCertificationDto: UpdateCertificationDto) {
        await this.findOne(id);

        return this.prisma.certification.update({
            where: { id },
            data: {
                ...updateCertificationDto,
                issueDate: updateCertificationDto.issueDate ? new Date(updateCertificationDto.issueDate) : undefined,
                expiryDate: updateCertificationDto.expiryDate ? new Date(updateCertificationDto.expiryDate) : undefined,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.certification.delete({
            where: { id },
        });
    }
}
