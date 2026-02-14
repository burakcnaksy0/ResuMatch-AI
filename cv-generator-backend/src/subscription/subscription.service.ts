import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum SubscriptionType {
    FREE = 'FREE',
    PRO = 'PRO',
}

export enum CVType {
    JOB_BASED = 'JOB_BASED',
    PROFILE_BASED = 'PROFILE_BASED',
}

// Free user limits
const FREE_JOB_BASED_LIMIT = 3;
const FREE_PROFILE_BASED_LIMIT = 1;

@Injectable()
export class SubscriptionService {
    constructor(private prisma: PrismaService) { }

    /**
     * Check if user can generate a CV based on their subscription
     */
    async canGenerateCV(userId: string, cvType: CVType): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                subscriptionType: true,
                jobBasedCVsUsed: true,
                profileBasedCVsUsed: true,
                subscriptionEndDate: true,
            },
        });

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        // PRO users have unlimited generation
        if (user.subscriptionType === SubscriptionType.PRO) {
            // Check if subscription is still active
            if (user.subscriptionEndDate && new Date(user.subscriptionEndDate) < new Date()) {
                // Subscription expired, downgrade to FREE
                await this.downgradeToFree(userId);
                return this.canGenerateCV(userId, cvType);
            }
            return true;
        }

        // FREE users have limits
        if (cvType === CVType.JOB_BASED) {
            return user.jobBasedCVsUsed < FREE_JOB_BASED_LIMIT;
        } else {
            return user.profileBasedCVsUsed < FREE_PROFILE_BASED_LIMIT;
        }
    }

    /**
     * Increment CV usage counter after successful generation
     */
    async incrementCVUsage(userId: string, cvType: CVType): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { subscriptionType: true },
        });

        // Only increment for FREE users (PRO users have unlimited)
        if (user?.subscriptionType === SubscriptionType.FREE) {
            if (cvType === CVType.JOB_BASED) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { jobBasedCVsUsed: { increment: 1 } },
                });
            } else {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { profileBasedCVsUsed: { increment: 1 } },
                });
            }
        }
    }

    /**
     * Get user's subscription status and usage
     */
    async getSubscriptionStatus(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                subscriptionType: true,
                subscriptionStartDate: true,
                subscriptionEndDate: true,
                jobBasedCVsUsed: true,
                profileBasedCVsUsed: true,
            },
        });

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        const isActive = user.subscriptionType === SubscriptionType.PRO &&
            (!user.subscriptionEndDate || new Date(user.subscriptionEndDate) >= new Date());

        return {
            subscriptionType: user.subscriptionType,
            isActive,
            subscriptionStartDate: user.subscriptionStartDate,
            subscriptionEndDate: user.subscriptionEndDate,
            usage: {
                jobBasedCVs: {
                    used: user.jobBasedCVsUsed,
                    limit: user.subscriptionType === SubscriptionType.FREE ? FREE_JOB_BASED_LIMIT : null,
                    remaining: user.subscriptionType === SubscriptionType.FREE
                        ? Math.max(0, FREE_JOB_BASED_LIMIT - user.jobBasedCVsUsed)
                        : null,
                },
                profileBasedCVs: {
                    used: user.profileBasedCVsUsed,
                    limit: user.subscriptionType === SubscriptionType.FREE ? FREE_PROFILE_BASED_LIMIT : null,
                    remaining: user.subscriptionType === SubscriptionType.FREE
                        ? Math.max(0, FREE_PROFILE_BASED_LIMIT - user.profileBasedCVsUsed)
                        : null,
                },
            },
        };
    }

    /**
     * Upgrade user to PRO subscription
     */
    async upgradeToPro(
        userId: string,
        billingCycle: 'monthly' | 'yearly',
    ): Promise<void> {
        const startDate = new Date();
        const endDate = new Date();

        if (billingCycle === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionType: SubscriptionType.PRO,
                subscriptionStartDate: startDate,
                subscriptionEndDate: endDate,
            },
        });
    }

    /**
     * Downgrade user to FREE subscription
     */
    async downgradeToFree(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionType: SubscriptionType.FREE,
                subscriptionStartDate: null,
                subscriptionEndDate: null,
            },
        });
    }

    /**
     * Get pricing information
     */
    getPricing() {
        return {
            free: {
                name: 'Free',
                price: 0,
                features: [
                    `${FREE_JOB_BASED_LIMIT} job-based CVs (total limit)`,
                    `${FREE_PROFILE_BASED_LIMIT} profile-based CV (total limit)`,
                    'Basic templates',
                    'ATS-optimized format',
                ],
                limits: {
                    jobBasedCVs: FREE_JOB_BASED_LIMIT,
                    profileBasedCVs: FREE_PROFILE_BASED_LIMIT,
                },
            },
            pro: {
                name: 'Pro',
                monthly: {
                    price: 15,
                    billingCycle: 'monthly',
                },
                yearly: {
                    price: 99,
                    billingCycle: 'yearly',
                    pricePerMonth: 8.25,
                    savings: 81, // $180 - $99
                },
                features: [
                    'Unlimited CV generation',
                    'All templates',
                    'Priority AI processing',
                    'Advanced customization',
                    'Premium support',
                ],
            },
        };
    }
}
