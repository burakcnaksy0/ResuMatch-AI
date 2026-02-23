import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (clientId) {
      this.googleClient = new OAuth2Client(clientId);
    }
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = this.generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        emailVerified: false,
        verificationCode,
        verificationCodeExpiry,
        profile: {
          create: {
            fullName: email.split('@')[0], // Default name
          },
        },
      },
    });

    // Create JWT
    const payload = { email: user.email, sub: user.id };

    // Send verification email
    this.mailService
      .sendVerificationEmail(email, verificationCode)
      .catch((err) => {
        this.logger.error('Failed to send verification email', err);
      });

    // Also send welcome email (optional, but keep it friendly)
    this.mailService
      .sendWelcomeEmail(email, email.split('@')[0])
      .catch((err) => {
        this.logger.error('Failed to send welcome email in background', err);
      });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        emailVerified: false, // Explicitly return false
      },
    };
  }

  async verifyEmail(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.emailVerified) {
      return { message: 'Email already verified' };
    }

    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (
      user.verificationCodeExpiry &&
      user.verificationCodeExpiry < new Date()
    ) {
      throw new BadRequestException('Verification code expired');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpiry: null,
      },
    });

    return { message: 'Email verified successfully', success: true };
  }

  async resendVerificationCode(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Rate limiting: Check if last code was sent less than 60 seconds ago
    if (user.lastCodeSentAt) {
      const secondsSinceLastSent = Math.floor(
        (Date.now() - user.lastCodeSentAt.getTime()) / 1000,
      );

      if (secondsSinceLastSent < 60) {
        const remainingSeconds = 60 - secondsSinceLastSent;
        throw new BadRequestException(
          `Please wait ${remainingSeconds} seconds before requesting a new code`,
        );
      }
    }

    const verificationCode = this.generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationCode,
        verificationCodeExpiry,
        lastCodeSentAt: new Date(),
      },
    });

    // Try to send email
    try {
      await this.mailService.sendVerificationEmail(
        user.email,
        verificationCode,
      );
      return { message: 'Verification code sent to your email' };
    } catch (error) {
      this.logger.error('Failed to send verification email (resend)', error);

      // In development, provide the code in the response
      const isDevelopment = process.env.NODE_ENV !== 'production';

      if (isDevelopment) {
        this.logger.warn(
          `DEV MODE: Verification code for ${user.email}: ${verificationCode}`,
        );
        return {
          message: `Email service unavailable. DEV CODE: ${verificationCode}`,
          isDevelopment: true,
        };
      }

      // In production, throw error
      throw new InternalServerErrorException(
        'Failed to send verification email. Please try again later or contact support.',
      );
    }
  }

  async changePassword(userId: string, changePasswordDto: any) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Validation regex: Min 8 chars, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and contain at least one uppercase letter and one number',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException('User has no password set (OAuth user)');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    this.mailService
      .sendPasswordChangeNotification(user.email)
      .catch((e) => this.logger.error(e));

    return { message: 'Password updated successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    };
  }

  async googleLogin(token: string) {
    try {
      let payload: any;
      const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

      if (clientId && this.googleClient) {
        const ticket = await this.googleClient.verifyIdToken({
          idToken: token,
          audience: clientId,
        });
        payload = ticket.getPayload();
      } else {
        this.logger.warn(
          'GOOGLE_CLIENT_ID not configured. Attempting unsafe decode for development.',
        );
        payload = this.jwtService.decode(token);
      }

      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google Token');
      }

      const { email, sub: googleId, name, picture } = payload;

      let user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Create user
        const randomPassword = Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        user = await this.prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            googleId,
            emailVerified: true, // Google trusted email? Usually yes.
            profile: {
              create: {
                fullName: name || email.split('@')[0],
                profilePictureUrl: picture,
              },
            },
          },
        });
      } else if (!user.googleId) {
        // Link googleId to existing user
        await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }

      const jwtPayload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(jwtPayload),
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      this.logger.error('Google Login Error', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent.' };
    }

    const token =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    await this.mailService.sendPasswordResetEmail(email, token);
    return { message: 'Reset link sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successfully' };
  }
}
