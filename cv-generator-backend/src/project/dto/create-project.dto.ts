import { IsString, IsOptional, IsDateString, IsArray, IsUrl } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    profileId: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    technologies?: string[];

    @IsOptional()
    @IsUrl()
    url?: string;

    @IsOptional()
    @IsUrl()
    githubUrl?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}
