import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filter/exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Cloami')
    .setDescription('Cloami - Backend')
    .setVersion('0.1')
    .addServer(
      env.SWAGGER_BASEPATH
        ? env.SWAGGER_BASEPATH
        : 'http://localhost:' + env.APP_PORT,
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(env.APP_PORT);
}
bootstrap();
