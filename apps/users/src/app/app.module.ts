import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URIUSERS),
    ConfigModule.forRoot({
      isGlobal: true, // Làm cho ConfigModule có sẵn trong toàn bộ ứng dụng
      envFilePath: '.env', // Sử dụng tệp .env từ thư mục gốc của workspace
    }),
    UsersModule,
  ],
})
export class AppModule {}
