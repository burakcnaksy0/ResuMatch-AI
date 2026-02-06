import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
