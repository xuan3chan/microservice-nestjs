import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admins, AdminsSchema } from '@my-workspace/common/schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([{ name:Admins.name, schema: AdminsSchema }]),
    ClientsModule.register([
      // {
      //   name: 'ROLE_PACKAGE',
      //   transport: Transport.GRPCd,
      //   options: {
      //     url: process.env.GRPC_CONNECTUSER, // Đặt cổng cho gRPC service
      //     package: 'ROLE_PACKAGE',
      //     protoPath: join(process.cwd(), 'proto/role.proto'),
      //   },
      // },
      {
        name: 'ROLE_RABBIT',
        transport: Transport.RMQ,
        options: {
          urls: [ 'amqp://admin:admin@localhost:5672'],
          queue: process.env.RABBITMQ_QUEUE || 'role_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
