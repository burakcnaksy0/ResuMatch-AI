// src/modules/cv/dto/generate-cv.dto.ts
import { IsUUID, IsString, IsIn, IsOptional, IsBoolean } from 'class-validator';

const VALID_TEMPLATES = [
  'modern',
  'classic',
  'minimal',
  'professional',
] as const;

export class GenerateCvDto {
  @IsUUID(4, { message: 'Geçerli bir job description ID giriniz' })
  jobDescriptionId: string;

  @IsString()
  @IsIn(VALID_TEMPLATES, {
    message: `Template şu değerlerden biri olmalı: ${VALID_TEMPLATES.join(', ')}`,
  })
  templateId: string;

  @IsOptional()
  @IsBoolean()
  includePhoto?: boolean;
}
