import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { EducationModule } from './education/education.module';
import { WorkExperienceModule } from './work-experience/work-experience.module';
import { SkillModule } from './skill/skill.module';
import { ProjectModule } from './project/project.module';
import { CertificationModule } from './certification/certification.module';
import { LanguageModule } from './language/language.module';
import { JobPostingModule } from './job-posting/job-posting.module';
import { AiModule } from './ai/ai.module';
import { GeneratedCvModule } from './generated-cv/generated-cv.module';
import { PdfModule } from './pdf/pdf.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PdfModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProfileModule,
    EducationModule,
    WorkExperienceModule,
    SkillModule,
    ProjectModule,
    CertificationModule,
    LanguageModule,
    JobPostingModule,
    AiModule,
    GeneratedCvModule,
    AuthModule,
    MailModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
