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
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post('upload-photo')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profiles',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    }))
    async uploadPhoto(
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        // Manual validation with better error messages
        if (!file) {
            throw new Error('No file uploaded');
        }

        // Validate file type
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Only JPG and PNG files are allowed');
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('File size must be less than 5MB');
        }

        // Construct the URL
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:8080';
        const photoUrl = `${baseUrl}/uploads/profiles/${file.filename}`;

        return this.profileService.updateProfilePhoto(req.user.userId, photoUrl);
    }

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
