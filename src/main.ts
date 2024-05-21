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

  // Access the version field
  const config = new DocumentBuilder()
    .setTitle('Nestjs')
    .setDescription(`Nestjs - Backend`)
    .setVersion('1.0')
    .addServer(
      env.SWAGGER_BASEPATH
        ? env.SWAGGER_BASEPATH
        : 'http://localhost:' + env.APP_PORT,
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(env.APP_PORT);
}
bootstrap();
