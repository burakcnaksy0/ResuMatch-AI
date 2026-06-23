import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { PromptBuilderService } from './prompt-builder/prompt-builder.service';

@Module({
  providers: [AiService, PromptBuilderService],
  exports: [AiService, PromptBuilderService],
})
export class AiModule {}
