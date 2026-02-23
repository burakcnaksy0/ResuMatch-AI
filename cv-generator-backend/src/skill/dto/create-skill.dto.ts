import { IsString, IsOptional } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  profileId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  proficiencyLevel?: string;
}
