import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { APP_NAME, EMAIL_FROM, LANDING_URL } from '../common/constants';

@Injectable()
export class MailService {
    private resend: Resend;
    private readonly logger = new Logger(MailService.name);

    constructor() {
        // Use environment variable first, then fallback to user's new key
        this.resend = new Resend(process.env.RESEND_API_KEY || 're_YiVzHqWX_HUCDvtP43HkiAx6ELe1EhpB6');
    }

    async sendWelcomeEmail(to: string, name: string) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: EMAIL_FROM,
                to: [to],
                subject: `Welcome to ${APP_NAME}`,
                html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563EB; margin: 0;">${APP_NAME}</h1>
                <p style="color: #666; font-size: 16px;">Intelligent Career Optimization</p>
            </div>
            
            <h2 style="color: #333;">Welcome, ${name}!</h2>
            <p style="color: #555; line-height: 1.6;">We are thrilled to have you on board. ${APP_NAME} is here to help you create job-winning CVs optimized for ATS algorithms.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${LANDING_URL}/dashboard" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Go to Dashboard</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">If you have any questions, feel free to reply to this email.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
          </div>
        `,
            });

            if (error) {
                this.logger.error('Resend API Error (Welcome):', error);
            } else {
                this.logger.log(`Welcome email sent to ${to}`);
            }
        } catch (error) {
            this.logger.error('Failed to send welcome email', error);
        }
    }

    async sendPasswordResetEmail(to: string, token: string) {
        try {
            const resetLink = `${LANDING_URL}/auth/reset-password?token=${token}`;

            const { data, error } = await this.resend.emails.send({
                from: EMAIL_FROM,
                to: [to],
                subject: `${APP_NAME} Password Reset Request`,
                html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #2563EB;">${APP_NAME}</h2>
            </div>
            <h3 style="color: #333; text-align: center;">Password Reset Request</h3>
            <p style="color: #555; line-height: 1.6;">We received a request to reset the password for your ${APP_NAME} account. If you didn't make this request, just ignore this email.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center;">This link will expire in 15 minutes.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">&copy; ${new Date().getFullYear()} ${APP_NAME}</p>
          </div>
        `,
            });

            if (error) {
                this.logger.error('Resend API Error:', error);
                throw new Error('Failed to send email');
            }

            this.logger.log(`Password reset email sent to ${to}`);
            return data;
        } catch (error) {
            this.logger.error('Failed to send password reset email', error);
            this.logger.debug(`For testing purposes (email failed): Reset Token is ${token}`);
            throw error;
        }
    }

    async sendVerificationEmail(to: string, code: string) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: EMAIL_FROM,
                to: [to],
                subject: `${APP_NAME} - Email Verification Code`,
                html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #2563EB;">${APP_NAME}</h2>
            </div>
            <h3 style="color: #333; text-align: center;">Verify Your Email Address</h3>
            <p style="color: #555; line-height: 1.6; text-align: center;">
                Please use the following code to verify your email address. This code will expire in 10 minutes.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span style="background-color: #f3f4f6; color: #1f2937; padding: 12px 24px; font-size: 24px; letter-spacing: 4px; font-weight: bold; border-radius: 6px; border: 1px solid #e5e7eb;">
                ${code}
              </span>
            </div>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">&copy; ${new Date().getFullYear()} ${APP_NAME}</p>
          </div>
        `,
            });

            if (error) {
                this.logger.error('Resend API Error (Verification):', error);
                throw new Error('Failed to send verification email');
            }

            this.logger.log(`Verification email sent to ${to}`);
            return data;
        } catch (error) {
            this.logger.error('Failed to send verification email', error);
            // In dev, log the code - VERY IMPORTANT for dev/test without verified domain
            this.logger.debug(`For testing purposes (email failed): Verification Code is ${code}`);
            throw error; // Re-throw so caller knows it failed
        }
    }

    async sendPasswordChangeNotification(to: string) {
        try {
            await this.resend.emails.send({
                from: EMAIL_FROM,
                to: [to],
                subject: `${APP_NAME} Security Alert - Password Changed`,
                html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #2563EB;">${APP_NAME}</h2>
            </div>
            <h3 style="color: #333; text-align: center;">Your Password Was Changed</h3>
            <p style="color: #555; line-height: 1.6;">
                The password for your ${APP_NAME} account was recently changed. If this was you, you can safely ignore this email.
            </p>
             <p style="color: #555; line-height: 1.6;">
                If you did not authorize this change, please contact support immediately or reset your password.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">&copy; ${new Date().getFullYear()} ${APP_NAME}</p>
          </div>
        `,
            });
            this.logger.log(`Password change notification sent to ${to}`);
        } catch (error) {
            this.logger.error('Failed to send password change notification', error);
        }
    }
}
