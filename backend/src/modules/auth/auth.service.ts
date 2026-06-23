// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '@prisma-service/prisma.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthException } from '@common/exceptions/base.exception';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
    @InjectRedis() private redis: Redis,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new AuthException('Bu email adresi zaten kullanımda');
    }

    const user = await this.userService.create({
      email: dto.email,
      passwordHash: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    return this.issueTokens(user.id);
  }

  async login(dto: LoginDto, ip: string) {
    const lockoutKey = `auth:lockout:${ip}`;
    const attemptKey = `auth:attempts:${ip}`;

    const isLocked = await this.redis.get(lockoutKey);
    if (isLocked) {
      throw new AuthException(
        'Çok fazla başarısız deneme. Lütfen 15 dakika bekleyin.',
      );
    }

    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      await this.handleFailedAttempt(ip, attemptKey, lockoutKey);
      throw new AuthException('Email veya şifre hatalı');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      await this.handleFailedAttempt(ip, attemptKey, lockoutKey, dto.email);
      throw new AuthException('Email veya şifre hatalı');
    }

    await this.redis.del(attemptKey);
    return this.issueTokens(user.id);
  }

  async refresh(userId: string, refreshToken: string) {
    const tokenHash = await this.hashToken(refreshToken);
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!storedToken) {
      throw new UnauthorizedException();
    }

    // Reuse detection
    if (storedToken.isRevoked) {
      await this.prisma.refreshToken.updateMany({
        where: { family: storedToken.family },
        data: { isRevoked: true },
      });
      throw new ForbiddenException(
        'Güvenlik ihlali tespit edildi. Lütfen tekrar giriş yapın.',
      );
    }

    // Mark current as used (revoked)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    // Provide new tokens with same family
    return this.issueTokens(userId, storedToken.family);
  }

  async logout(refreshToken: string) {
    const tokenHash = await this.hashToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { isRevoked: true },
    });
  }

  private async issueTokens(userId: string, familyId?: string) {
    const family = familyId ?? crypto.randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.config.get('jwt.accessSecret'),
          expiresIn: this.config.get('jwt.accessExpiresIn'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, family },
        {
          secret: this.config.get('jwt.refreshSecret'),
          expiresIn: this.config.get('jwt.refreshExpiresIn'),
        },
      ),
    ]);

    // Save refresh token
    const tokenHash = await this.hashToken(refreshToken);
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        family,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { accessToken, refreshToken };
  }

  private async hashToken(token: string): Promise<string> {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async handleFailedAttempt(
    ip: string,
    attemptKey: string,
    lockoutKey: string,
    email?: string,
  ) {
    const attempts = await this.redis.incr(attemptKey);
    await this.redis.expire(attemptKey, 900); // 15 min

    if (attempts >= 5) {
      await this.redis.setex(lockoutKey, 900, '1');
      this.logger.warn({ event: 'ACCOUNT_LOCKOUT', ip, email });
    }
  }
}
