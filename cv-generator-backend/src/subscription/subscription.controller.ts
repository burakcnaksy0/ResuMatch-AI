import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsString, IsIn } from 'class-validator';

class UpgradeDto {
    @IsString()
    @IsIn(['monthly', 'yearly'])
    billingCycle: 'monthly' | 'yearly';
}

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    async getStatus(@Request() req: any) {
        const userId = req.user.userId;
        return this.subscriptionService.getSubscriptionStatus(userId);
    }

    @Get('pricing')
    getPricing() {
        return this.subscriptionService.getPricing();
    }

    @Post('upgrade')
    @UseGuards(JwtAuthGuard)
    async upgrade(@Request() req: any, @Body() upgradeDto: UpgradeDto) {
        const userId = req.user.userId;
        // In a real application, this would integrate with a payment processor
        // For now, we'll just upgrade the user directly
        await this.subscriptionService.upgradeToPro(userId, upgradeDto.billingCycle);
        return {
            success: true,
            message: 'Subscription upgraded successfully',
        };
    }

    @Post('downgrade')
    @UseGuards(JwtAuthGuard)
    async downgrade(@Request() req: any) {
        const userId = req.user.userId;
        await this.subscriptionService.downgradeToFree(userId);
        return {
            success: true,
            message: 'Subscription downgraded to free',
        };
    }
}
