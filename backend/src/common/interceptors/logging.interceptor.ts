// src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers } = request;
    const userId = request.user?.id;
    const startTime = Date.now();

    this.logger.log({
      type: 'REQUEST',
      method,
      url,
      userId: userId ?? 'anonymous',
      userAgent: headers['user-agent'],
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.log({
            type: 'RESPONSE',
            method,
            url,
            statusCode: context.switchToHttp().getResponse().statusCode,
            duration: `${duration}ms`,
            userId: userId ?? 'anonymous',
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error({
            type: 'RESPONSE_ERROR',
            method,
            url,
            error: error.message,
            duration: `${duration}ms`,
            userId: userId ?? 'anonymous',
          });
        },
      }),
    );
  }
}
