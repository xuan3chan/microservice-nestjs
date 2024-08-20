import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình gRPC cho User Service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_CONNECTUSER, // Đặt cổng cho gRPC service
      package: 'USER_PACKAGE',
      protoPath: join(process.cwd(), 'proto/users.proto'),
    },
  });

  // Cấu hình RabbitMQ cho User Service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [ 'amqp://admin:admin@localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'user_queue',
      queueOptions: {
        durable: true,
      },
      prefetchCount: 10,
    },
  });
  
  

  // Khởi động tất cả các microservice
  await app.startAllMicroservices();

  // Cấu hình HTTP server
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORTUSER || 3002;
  await app.listen(port);

  Logger.log(
    `🚀 User Service is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
