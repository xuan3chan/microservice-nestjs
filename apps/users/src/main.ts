import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Configure gRPC for User Service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_CONNECTUSER, // Ensure the environment variable is set
      package: 'USER_PACKAGE',
      protoPath: join(process.cwd(), 'proto/users.proto'),
    },
  });

  // Configure RabbitMQ for User Service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      queue:'user_queue',
      prefetchCount: 10,
    },
  });

  // Use global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Start all microservices
  await app.startAllMicroservices().then(() => {
    logger.log('All microservices started successfully');
  }).catch(error => {
    logger.error('Error starting microservices', error);
  });

  // Configure HTTP server
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORTUSER || 3002;
  
  await app.listen(port).then(() => {
    logger.log(`🚀 User Service is running on: http://localhost:${port}/${globalPrefix}`);
  }).catch(error => {
    logger.error('Error starting HTTP server', error);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM signal received: closing HTTP server and microservices');
    await app.close();
    logger.log('HTTP server and microservices closed gracefully');
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('SIGINT signal received: closing HTTP server and microservices');
    await app.close();
    logger.log('HTTP server and microservices closed gracefully');
    process.exit(0);
  });
}

bootstrap();
