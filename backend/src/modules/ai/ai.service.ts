// src/modules/ai/ai.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import OpenAI from 'openai';
import { createHash } from 'crypto';
import { PromptBuilderService } from './prompt-builder/prompt-builder.service';
import { CvData, CvDataSchema } from './dto/ai-response.dto';
import { AiServiceException } from '@common/exceptions/base.exception';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(
    private config: ConfigService,
    private promptBuilder: PromptBuilderService,
    @InjectRedis() private redis: Redis,
  ) {
    this.openai = new OpenAI({
      baseURL: 'https://router.huggingface.co/v1',
      apiKey: this.config.get<string>('HUGGINGFACE_API_KEY') || process.env.HUGGINGFACE_API_KEY,
    });
  }

  async generateCV(profile: any, jobDescription: any): Promise<CvData> {
    const profileHash = this.hashData(profile);
    const jdHash = this.hashData({ text: jobDescription.rawText });
    const cacheKey = `ai:cv:${profileHash}:${jdHash}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.log('AI Cache hit', { cacheKey });
      return JSON.parse(cached);
    }

    const systemPrompt = this.promptBuilder.getSystemPrompt();
    const userPrompt = this.promptBuilder.buildUserPrompt(
      profile,
      jobDescription,
    );

    const models = ['Qwen/Qwen2.5-14B-Instruct:featherless-ai'];

    let lastError: any = null;

    for (const model of models) {
      try {
        const result = await this.callAI(model, systemPrompt, userPrompt);
        await this.redis.setex(cacheKey, 86400, JSON.stringify(result));
        return result;
      } catch (error: any) {
        lastError = error;
        const status = error?.status || error?.response?.status;
        this.logger.warn(
          `Model ${model} failed with status ${status || 'unknown'}. Error: ${error.message}`,
        );

        // If it's a 400 error (validation or bad prompt), don't bother retrying with same prompt
        if (status === 400) break;

        // Continue to next model if available
        this.logger.log(`Attempting next model...`);
      }
    }

    this.logger.error('All AI models failed to generate CV', {
      error: lastError?.message,
      modelsTried: models,
    });

    throw new AiServiceException(
      `Yapay zeka servisine erişilemedi. Lütfen bağlantınızı kontrol edip biraz sonra tekrar deneyin.`,
    );
  }

  private async callAI(
    model: string,
    systemPrompt: string,
    userPrompt: string,
  ): Promise<CvData> {
    try {
      this.logger.log(`Calling AI API with model: ${model}`);
      const startTime = Date.now();

      const completion = await this.openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
      });

      let rawResponse = completion.choices[0].message.content;
      if (!rawResponse) throw new Error('AI returned empty response');

      // Clean up potential markdown code blocks that Qwen might generate
      rawResponse = rawResponse
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '')
        .trim();

      // Try to find the first '{' and last '}' if the model added conversational filler
      const startIndex = rawResponse.indexOf('{');
      const endIndex = rawResponse.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        rawResponse = rawResponse.slice(startIndex, endIndex + 1);
      }

      const parsed = JSON.parse(rawResponse);
      const validation = CvDataSchema.safeParse(parsed);

      if (!validation.success) {
        this.logger.error('AI response failed schema validation', {
          errors: validation.error.format(),
        });
        throw new AiServiceException(
          'Yapay zeka yanıtı eksik veya hatalı formatta ulaştı. Lütfen işlemi tekrar deneyin.',
        );
      }

      const duration = Date.now() - startTime;
      this.logger.log('AI Generation successful', {
        duration: `${duration}ms`,
        model,
      });

      return validation.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message;
      this.logger.error(`CV Generation failed (model: ${model})`, {
        error: errorMessage,
        status: error?.status || error?.response?.status,
      });

      // Re-throw with status info preserved for fallback logic
      const wrapped: any = new AiServiceException(
        `Yapay zeka servisi şu anda yanıt veremiyor (Bağlantı veya yoğunluk kaynaklı olabilir). Lütfen biraz sonra tekrar deneyin.`,
        { cause: error },
      );
      wrapped.status = error?.status || error?.response?.status;
      throw wrapped;
    }
  }

  private hashData(data: any): string {
    return createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex')
      .slice(0, 16);
  }
}
