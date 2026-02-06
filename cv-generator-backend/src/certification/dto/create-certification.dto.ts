import { IsString, IsOptional, IsDateString, IsUrl } from 'class-validator';

export class CreateCertificationDto {
    @IsString()
    profileId: string;

    @IsString()
    name: string;

    @IsString()
    issuer: string;

    @IsDateString()
    issueDate: string;

    @IsOptional()
    @IsDateString()
    expiryDate?: string;

    @IsOptional()
    @IsString()
    credentialId?: string;

    @IsOptional()
    @IsUrl()
    credentialUrl?: string;
}
