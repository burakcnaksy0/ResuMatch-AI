import {
  IsString,
  IsOptional,
  IsDateString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

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
  @ValidateIf((o) => o.expiryDate !== '')
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  credentialId?: string;

  @IsOptional()
  @ValidateIf((o) => o.credentialUrl !== '')
  @IsUrl()
  credentialUrl?: string;
}
