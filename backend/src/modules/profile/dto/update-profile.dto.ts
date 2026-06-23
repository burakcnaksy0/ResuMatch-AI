// src/modules/profile/dto/update-profile.dto.ts
import {
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

/** Normalize a URL value: trim whitespace, return undefined for empty/null */
const normalizeUrl = ({ value }: { value: any }) => {
  if (value === null || value === undefined) return undefined;
  const trimmed = String(value).trim();
  return trimmed === '' ? undefined : trimmed;
};

class ExperienceDto {
  @IsString()
  id: string;

  @IsString()
  company: string;

  @IsString()
  title: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string | null;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];
}

class EducationDto {
  @IsString()
  id: string;

  @IsString()
  institution: string;

  @IsString()
  degree: string;

  @IsString()
  field: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string | null;

  @IsOptional()
  @IsString()
  gpa?: string;
}

class SkillDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  category: string;

  @IsArray()
  @IsString({ each: true })
  items: string[];
}

class CertificationDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  issuer: string;

  @IsString()
  date: string;

  @IsOptional()
  @Transform(normalizeUrl)
  @IsUrl(
    { require_protocol: true, require_tld: true },
    { message: 'Certification URL must be a valid URL including http:// or https://' },
  )
  url?: string;
}

class LanguageDto {
  @IsString()
  language: string;

  @IsString()
  level: string;
}

class ProjectDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(normalizeUrl)
  @IsUrl(
    { require_protocol: true, require_tld: true },
    { message: 'Project URL must be a valid URL including http:// or https://' },
  )
  url?: string;

  @IsOptional()
  @IsString()
  technologies?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  headline?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @Transform(normalizeUrl)
  @IsUrl(
    { require_protocol: true, require_tld: true },
    { message: 'Website must be a valid URL including http:// or https://' },
  )
  website?: string;

  @IsOptional()
  @Transform(normalizeUrl)
  @IsUrl(
    { require_protocol: true, require_tld: true },
    { message: 'LinkedIn must be a valid URL including http:// or https://' },
  )
  linkedin?: string;

  @IsOptional()
  @Transform(normalizeUrl)
  @IsUrl(
    { require_protocol: true, require_tld: true },
    { message: 'GitHub must be a valid URL including http:// or https://' },
  )
  github?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experiences?: ExperienceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  educations?: EducationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills?: SkillDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  certifications?: CertificationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  languages?: LanguageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  projects?: ProjectDto[];
}
