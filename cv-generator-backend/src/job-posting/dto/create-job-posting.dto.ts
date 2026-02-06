import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateJobPostingDto {
    @IsOptional()
    @IsString()
    userId: string;

    @IsString()
    jobTitle: string;

    @IsOptional()
    @IsString()
    company?: string;

    @IsOptional()
    @IsUrl()
    jobUrl?: string;

    @IsString()
    jobDescription: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    requiredSkills?: string[];

    @IsOptional()
    @IsString()
    experienceLevel?: string;
}
