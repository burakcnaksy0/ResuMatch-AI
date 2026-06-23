// src/common/exceptions/base.exception.ts
import { HttpException } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    public readonly message: string,
    public readonly errorCode: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super({ message, errorCode, details }, statusCode);
  }
}

export class AuthException extends AppException {
  constructor(message = 'Authentication failed', details?: unknown) {
    super(message, 'AUTH_ERROR', 401, details);
  }
}

export class NotFoundException extends AppException {
  constructor(resource: string) {
    super(`${resource} bulunamadı`, 'NOT_FOUND', 404);
  }
}

export class ValidationException extends AppException {
  constructor(details: unknown) {
    super('Doğrulama hatası', 'VALIDATION_ERROR', 400, details);
  }
}

export class AiServiceException extends AppException {
  constructor(message: string, details?: unknown) {
    super(message, 'AI_SERVICE_ERROR', 503, details);
  }
}

export class RateLimitException extends AppException {
  constructor() {
    super(
      'Çok fazla istek gönderdiniz. Lütfen bekleyin.',
      'RATE_LIMIT_EXCEEDED',
      429,
    );
  }
}
