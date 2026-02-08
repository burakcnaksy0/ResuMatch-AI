import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('google-login')
    @HttpCode(HttpStatus.OK)
    googleLogin(@Body() body: { token: string }) {
        return this.authService.googleLogin(body.token);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    resetPassword(@Body() body: { token: string, newPassword: string }) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }

    @UseGuards(JwtAuthGuard)
    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    verifyEmail(@Request() req, @Body() body: { code: string }) {
        return this.authService.verifyEmail(req.user.userId, body.code);
    }

    @UseGuards(JwtAuthGuard)
    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    resendVerification(@Request() req) {
        return this.authService.resendVerificationCode(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    changePassword(@Request() req, @Body() body: any) {
        return this.authService.changePassword(req.user.userId, body);
    }
}
