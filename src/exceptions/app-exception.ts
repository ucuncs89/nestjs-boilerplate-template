import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
export class AppErrorException extends BadRequestException {
  constructor(message?: string, error_code?: string) {
    super({
      message: message || 'error',
      error_code: error_code || 'err',
    });
  }
}

export class AppErrorNotFoundException extends NotFoundException {
  constructor(message?: string, error_code?: string) {
    super({
      message: message || 'error not found',
      error_code: error_code || 'err-not-found',
    });
  }
}

export class AppErrorUnauthorizedException extends UnauthorizedException {
  constructor(message?: string, error_code?: string) {
    super({
      message: message || 'Unauthorized',
      error_code: error_code || 'Unauthorized',
    });
  }
}

export class AppErrorOtpException extends BadRequestException {
  constructor(message?: string, error_code?: string, data?: any) {
    super({
      message: message || 'error',
      error_code: error_code || 'err',
      data: data || null,
    });
  }
}

export class AppErrorForbiddenException extends ForbiddenException {
  constructor(message?: string, error_code?: string) {
    super({
      message: message || 'Forbidden',
      error_code: error_code || 'Forbidden',
    });
  }
}
