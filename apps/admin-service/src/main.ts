import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
// Cấu hình HTTP server
const globalPrefix = 'api';
app.setGlobalPrefix(globalPrefix);
const port = process.env.PORTADMIN || 3106;


// Cấu hình Swagger
const config = new DocumentBuilder()
  .setTitle('API-GATEWAY')
  .setDescription('The API description')
  .setVersion('1.0')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  // Cấu hình gRPC cho User Service
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     url: process.env.GRPC_CONNECTUSER, // Đặt cổng cho gRPC service
  //     package: 'USER_PACKAGE',
  //     protoPath: join(process.cwd(), 'proto/users.proto'),
  //   },
  // });

  // Cấu hình RabbitMQ cho User Service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      queue:'admin_queue',
      prefetchCount: 10,
    },  
  });

  // Khởi động tất cả các microservice
  await app.startAllMicroservices();

  
  await app.listen(port);
  Logger.log(
    `🚀 Admin Service is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();