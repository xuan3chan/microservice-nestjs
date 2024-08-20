import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_CONNECTUSER, // Đặt cổng cho gRPC service
          package: 'USER_PACKAGE',
          protoPath: join(process.cwd(), 'proto/users.proto'),
        },
      },
      {
        name: 'USER_RABBIT',
        transport: Transport.RMQ,
        options: {
          urls: [ 'amqp://admin:admin@localhost:5672'],
          queue: process.env.RABBITMQ_QUEUE || 'user_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService,
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ],
})
export class AuthenticationModule {}
