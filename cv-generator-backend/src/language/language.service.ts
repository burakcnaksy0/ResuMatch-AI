import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguageService {
    constructor(private prisma: PrismaService) { }

    async create(createLanguageDto: CreateLanguageDto) {
        return this.prisma.language.create({
            data: createLanguageDto,
        });
    }

    async findAllByProfile(profileId: string) {
        return this.prisma.language.findMany({
            where: { profileId },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const language = await this.prisma.language.findUnique({
            where: { id },
        });

        if (!language) {
            throw new NotFoundException(`Language with ID ${id} not found`);
        }

        return language;
    }

    async update(id: string, updateLanguageDto: UpdateLanguageDto) {
        await this.findOne(id);

        return this.prisma.language.update({
            where: { id },
            data: updateLanguageDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.language.delete({
            where: { id },
        });
    }
}
