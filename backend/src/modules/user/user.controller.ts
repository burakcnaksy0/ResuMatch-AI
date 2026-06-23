import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Public } from '@common/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request) {
    const userId = (req as any).user?.id;
    const user = await this.userService.findById(userId);
    return {
      id: user?.id,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      role: user?.role,
    };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Req() req: Request, @Body() data: any) {
    const userId = (req as any).user?.id;
    const updateData: any = { ...data };

    // Hash password if it's being updated
    if (updateData.password) {
      const bcrypt = require('bcrypt');
      updateData.passwordHash = await bcrypt.hash(updateData.password, 12);
      delete updateData.password;
    }

    const user = await this.userService.update(userId, updateData);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteMe(@Req() req: Request) {
    const userId = (req as any).user?.id;
    await this.userService.softDelete(userId);
    return { success: true };
  }
}
