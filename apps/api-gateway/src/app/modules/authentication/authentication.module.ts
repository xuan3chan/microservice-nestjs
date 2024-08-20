import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_CONNECTAUTH, // Đặt cổng cho gRPC service
          package: 'AUTH_PACKAGE',
          protoPath: join(process.cwd(), 'proto/auth.proto'),
        },
      },
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}