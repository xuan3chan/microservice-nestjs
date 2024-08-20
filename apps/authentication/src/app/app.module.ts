import { Module } from '@nestjs/common';


import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthenticationModule,
      ConfigModule.forRoot({
        isGlobal: true, // Làm cho ConfigModule có sẵn trong toàn bộ ứng dụng
        envFilePath: '.env', // Sử dụng tệp .env từ thư mục gốc của workspace
      }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
