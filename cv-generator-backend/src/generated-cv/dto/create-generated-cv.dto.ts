import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateGeneratedCvDto {
    @IsString()
    profileId: string;

    @IsOptional()
    @IsString()
    jobPostingId?: string;

    @IsOptional()
    @IsBoolean()
    includeProfilePicture?: boolean;

    @IsOptional()
    @IsString()
    tone?: string;

    @IsOptional()
    @IsString()
    cvSpecificPhotoUrl?: string;

    @IsOptional()
    @IsString()
    templateName?: string;

    @IsOptional()
    @IsString()
    contentLanguage?: string;
}
