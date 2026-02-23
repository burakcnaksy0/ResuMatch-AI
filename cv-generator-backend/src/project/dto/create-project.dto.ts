import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsUrl,
  ValidateIf,
} from 'class-validator';

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
  @ValidateIf((o) => o.url !== '')
  @IsUrl()
  url?: string;

  @IsOptional()
  @ValidateIf((o) => o.githubUrl !== '')
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @ValidateIf((o) => o.startDate !== '')
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @ValidateIf((o) => o.endDate !== '')
  @IsDateString()
  endDate?: string;
}
