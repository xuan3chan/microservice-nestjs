import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_CONNECTAUTH, // Đặt cổng cho gRPC service
      package: 'AUTH_PACKAGE',
      protoPath: join(process.cwd(), 'proto/auth.proto'),
    },
  });
  // Khởi động tất cả các microservice
  await app.startAllMicroservices();

  // Cấu hình HTTP server
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORTAUTH || 3001;
  await app.listen(port);

  Logger.log(
    `🚀 Auth Service is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
