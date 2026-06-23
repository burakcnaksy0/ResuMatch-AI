// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';
import { redisConfig } from './config/redis.config';
import { openaiConfig } from './config/openai.config';
import { ProfileModule } from './modules/profile/profile.module';
import { JobModule } from './modules/job/job.module';
import { AiModule } from './modules/ai/ai.module';
import { QueueModule } from './modules/queue/queue.module';
import { CvModule } from './modules/cv/cv.module';
import { BackupModule } from './modules/backup/backup.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // Global Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, redisConfig, openaiConfig],
    }),

    // Global Database
    PrismaModule,

    // Global Redis
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        config: {
          host: config.get<string>('redis.host') || 'localhost',
          port: config.get<number>('redis.port') || 6379,
          password: config.get<string>('redis.password'),
        },
      }),
    }),

    // Global Queueing
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
          password: config.get<string>('redis.password'),
        },
      }),
    }),

    // Domain Modules
    AuthModule,
    UserModule,
    ProfileModule,
    JobModule,
    AiModule,
    QueueModule,
    CvModule,

    // Scheduler (cron jobs)
    ScheduleModule.forRoot(),
    BackupModule,
  ],
  providers: [
    // Global Auth Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
