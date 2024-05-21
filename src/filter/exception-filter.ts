import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http';

export const getStatusCode = (exception: unknown): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = (exception: unknown): string => {
  return String(exception);
};

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IncomingMessage>();
    const code = getStatusCode(exception);
    const status = exception.getStatus();
    const bodyMessage = exception.response;

    let error_code: any;
    if (Array.isArray(bodyMessage.message)) {
      error_code = bodyMessage.message[0];
    } else {
      error_code = bodyMessage.error_code;
    }
    response.status(+status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      status_code: code,
      error_code,
      message: Array.isArray(bodyMessage.message)
        ? bodyMessage.message[0]
        : bodyMessage.message,
      data: bodyMessage.data || null,
    });
  }
}
