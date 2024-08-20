/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORTAPI;
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
  .setTitle('API-GATEWAY')
  .setDescription('The API description')
  .setVersion('1.0')
  .addBearerAuth(
    {type: 'http', scheme: 'bearer', bearerFormat: 'JWT'},
  )
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(port);
  Logger.log(
    `🚀 Gateway is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
