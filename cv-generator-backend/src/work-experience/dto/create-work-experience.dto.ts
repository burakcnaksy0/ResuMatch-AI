import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateWorkExperienceDto {
    @IsString()
    profileId: string;

    @IsString()
    company: string;

    @IsString()
    position: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    achievements?: string[];
}
