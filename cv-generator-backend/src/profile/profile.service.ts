import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    private calculateCompleteness(profile: any) {
        let score = 0;
        const details: any = {};
        const suggestions: string[] = [];

        // 1. Personal Info (15%)
        let infoScore = 0;
        const infoFields = ['fullName', 'title', 'email', 'phone', 'location', 'professionalSummary'];
        infoFields.forEach(field => {
            if (profile[field]) infoScore += (15 / infoFields.length);
            else {
                // Formatting field name for suggestion
                const readableField = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                suggestions.push(`Add ${readableField}`);
            }
        });
        details.personalInfo = Math.round(Math.min(infoScore, 15));
        score += infoScore;

        // 2. Skills (20%)
        const skillsCount = profile.skills?.length || 0;
        const skillScore = Math.min(skillsCount * 4, 20); // 5 skills = 20%
        details.skills = skillScore;
        score += skillScore;
        if (skillsCount < 5) suggestions.push(`Add ${5 - skillsCount} more skills`);

        // 3. Work Experience (25%)
        const expCount = profile.workExperience?.length || 0;
        // Each entry adds up to 12.5%, max 25%
        const expScore = Math.min(expCount * 12.5, 25);
        details.workExperience = expScore;
        score += expScore;
        if (expCount === 0) suggestions.push('Add work experience');

        // 4. Education (15%)
        const eduCount = profile.education?.length || 0;
        const eduScore = Math.min(eduCount * 15, 15); // 1 education is enough
        details.education = eduScore;
        score += eduScore;
        if (eduCount === 0) suggestions.push('Add education');

        // 5. Projects (15%)
        const projCount = profile.projects?.length || 0;
        // Each adds 7.5%, max 15%
        const projScore = Math.min(projCount * 7.5, 15);
        details.projects = projScore;
        score += projScore;
        if (projCount === 0) suggestions.push('Add projects');

        // 6. Photo (10%)
        const photoScore = profile.profilePictureUrl ? 10 : 0;
        details.photo = photoScore;
        score += photoScore;
        if (!profile.profilePictureUrl) suggestions.push('Upload profile photo');

        return {
            ...profile,
            completeness: {
                total: Math.round(Math.min(score, 100)),
                breakdown: details,
                suggestions: suggestions.slice(0, 5)
            }
        };
    }

    async create(createProfileDto: CreateProfileDto) {
        const existingProfile = await this.prisma.profile.findUnique({
            where: { userId: createProfileDto.userId },
        });

        if (existingProfile) {
            throw new ConflictException('Profile already exists for this user');
        }

        const profile = await this.prisma.profile.create({
            data: createProfileDto,
            include: {
                education: true,
                workExperience: true,
                skills: true,
                projects: true,
                certifications: true,
                languages: true,
            }
        });
        return this.calculateCompleteness(profile);
    }

    async findAll() {
        const profiles = await this.prisma.profile.findMany({
            include: {
                education: true,
                workExperience: true,
                skills: true,
                projects: true,
                certifications: true,
                languages: true,
            },
        });
        return profiles.map(p => this.calculateCompleteness(p));
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

        return this.calculateCompleteness(profile);
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

        return this.calculateCompleteness(profile);
    }

    async updateProfilePhoto(userId: string, photoUrl: string) {
        let profile = await this.prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            profile = await this.prisma.profile.create({
                data: {
                    userId,
                    profilePictureUrl: photoUrl,
                },
            });
        } else {
            await this.prisma.profile.update({
                where: { id: profile.id },
                data: { profilePictureUrl: photoUrl },
            });
        }

        return this.findByUserId(userId);
    }

    async update(id: string, updateProfileDto: UpdateProfileDto) {
        // Check existence logic can be refined, but allow error to propagate from update if not found is acceptable 
        // OR reuse findOne logic. Since we modify return type, let's just rely on prisma update throwing or findOne check.
        // To be safe and consistent with previous implementation:
        try {
            const profile = await this.prisma.profile.update({
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
            return this.calculateCompleteness(profile);
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Profile with ID ${id} not found`);
            }
            throw error;
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.profile.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Profile with ID ${id} not found`);
            }
            throw error;
        }
    }
}
