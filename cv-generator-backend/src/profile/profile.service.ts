import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async create(createProfileDto: CreateProfileDto) {
        // Check if profile already exists for this user
        const existingProfile = await this.prisma.profile.findUnique({
            where: { userId: createProfileDto.userId },
        });

        if (existingProfile) {
            throw new ConflictException('Profile already exists for this user');
        }

        return this.prisma.profile.create({
            data: createProfileDto,
        });
    }

    async findAll() {
        return this.prisma.profile.findMany({
            include: {
                education: true,
                workExperience: true,
                skills: true,
                projects: true,
                certifications: true,
                languages: true,
            },
        });
    }

    async findOne(id: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { id },
            include: {
                education: true,
                workExperience: true,
                skills: true,
                projects: true,
                certifications: true,
                languages: true,
            },
        });

        if (!profile) {
            throw new NotFoundException(`Profile with ID ${id} not found`);
        }

        return profile;
    }

    async findByUserId(userId: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: {
                education: true,
                workExperience: true,
                skills: true,
                projects: true,
                certifications: true,
                languages: true,
            },
        });

        if (!profile) {
            throw new NotFoundException(`Profile for user ${userId} not found`);
        }

        return profile;
    }

    async update(id: string, updateProfileDto: UpdateProfileDto) {
        // Check if profile exists
        await this.findOne(id);

        return this.prisma.profile.update({
            where: { id },
            data: updateProfileDto,
            include: {
                education: true,
                workExperience: true,
                skills: true,
                projects: true,
                certifications: true,
                languages: true,
            },
        });
    }

    async remove(id: string) {
        // Check if profile exists
        await this.findOne(id);

        return this.prisma.profile.delete({
            where: { id },
        });
    }
}
