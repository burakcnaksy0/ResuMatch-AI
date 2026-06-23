// src/modules/job/dto/create-job.dto.ts
import { IsString, IsOptional, IsNotEmpty, MinLength } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50, { message: 'İş ilanı metni en az 50 karakter olmalıdır' })
  rawText: string;
}
