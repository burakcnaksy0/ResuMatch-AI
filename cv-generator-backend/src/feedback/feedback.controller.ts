import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Request() req, @Body() createFeedbackDto: CreateFeedbackDto) {
        return this.feedbackService.create(req.user.userId, createFeedbackDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.feedbackService.findAllByUser(req.user.userId);
    }
}
