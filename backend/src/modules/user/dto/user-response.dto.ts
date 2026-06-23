// src/modules/user/dto/user-response.dto.ts
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;
}
