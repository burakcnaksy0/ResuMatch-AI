import { IsString, IsOptional } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  profileId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  proficiency?: string;
}
