import { IsString, IsOptional, IsEmail, IsUrl, MaxLength } from 'class-validator';

export class CreateProfileDto {
    @IsOptional()
    @IsString()
    userId: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    fullName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsUrl()
    linkedinUrl?: string;

    @IsOptional()
    @IsUrl()
    githubUrl?: string;

    @IsOptional()
    @IsUrl()
    portfolioUrl?: string;

    @IsOptional()
    @IsString()
    professionalSummary?: string;

    @IsOptional()
    @IsString()
    profilePictureUrl?: string;
}
