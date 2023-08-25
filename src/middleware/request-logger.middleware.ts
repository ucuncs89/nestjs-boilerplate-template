import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RabbitMQService } from 'src/rabbitmq/services/rabbit-mq.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode = res.statusCode;
      if (statusCode === 400 || statusCode === 403) {
        this.rabbitMQService.send('cloami-error-log', {
          path: req.url,
          status_code: statusCode,
          payload: req.body ? JSON.stringify(req.body) : null,
          query: req.query ? JSON.stringify(req.query) : null,
          message: res.statusMessage,
          token: req.headers.authorization
            ? JSON.stringify(req.headers.authorization)
            : null,
          user: req.user ? req.user : null,
        });
      }
    });
    next();
  }
}
