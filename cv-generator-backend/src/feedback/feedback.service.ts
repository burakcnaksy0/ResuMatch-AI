import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createFeedbackDto: CreateFeedbackDto) {
        return this.prisma.feedback.create({
            data: {
                userId,
                description: createFeedbackDto.description,
            },
        });
    }

    async findAllByUser(userId: string) {
        return this.prisma.feedback.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
