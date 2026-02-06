import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Request() req, @Body() createProfileDto: CreateProfileDto) {
        // Enforce userId from valid token
        createProfileDto.userId = req.user.userId;
        return this.profileService.create(createProfileDto);
    }

    @Get('me')
    async findMyProfile(@Request() req) {
        return this.profileService.findByUserId(req.user.userId);
    }

    @Get()
    findAll() {
        return this.profileService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.profileService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
        return this.profileService.update(id, updateProfileDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.profileService.remove(id);
    }
}
