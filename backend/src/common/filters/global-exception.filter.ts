// src/common/filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppException } from '../exceptions/base.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let details: unknown;

    if (exception instanceof AppException) {
      status = exception.statusCode;
      errorCode = exception.errorCode;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse() as any;
      message = typeof body === 'string' ? body : body.message;
      errorCode = 'HTTP_EXCEPTION';
    } else if (exception instanceof Error) {
      this.logger.error('Unhandled exception', {
        error: exception.message,
        stack: exception.stack,
        path: request.url,
      });
    }

    if (status >= 500) {
      this.logger.error('Server error', {
        status,
        message,
        path: request.url,
        method: request.method,
        userId: (request as any).user?.id,
      });
    }

    const responseBody: any = {
      success: false,
      error: {
        code: errorCode,
        message,
      },
      timestamp: new Date().toISOString(),
    };

    if (details) {
      responseBody.error.details = details;
    }

    response.status(status).json(responseBody);
  }
}
