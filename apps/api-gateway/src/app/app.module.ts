import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './modules/authentication/authentication.module';


@Module({
  imports: [
    AuthenticationModule,
    ConfigModule.forRoot({
      isGlobal: true, // Làm cho ConfigModule có sẵn trong toàn bộ ứng dụng
      envFilePath: '.env', // Sử dụng tệp .env từ thư mục gốc của workspace
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
