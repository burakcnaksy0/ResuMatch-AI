// src/common/guards/rate-limit.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { RateLimitException } from '@common/exceptions/base.exception';

export interface RateLimitConfig {
  name: string;
  maxRequests: number;
  windowSeconds: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    @InjectRedis() private redis: Redis,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const config = this.reflector.get<RateLimitConfig>(
      'rateLimit',
      context.getHandler(),
    );

    if (!config) return true; // No rate limit configured for this route

    // Use user ID if authenticated, otherwise use IP
    const identifier = request.user?.id ?? request.ip;
    const key = `rate:${config.name}:${identifier}`;

    const current = await this.redis.incr(key);

    if (current === 1) {
      // First request in this window - set TTL
      await this.redis.expire(key, config.windowSeconds);
    }

    if (current > config.maxRequests) {
      throw new RateLimitException();
    }

    return true;
  }
}
