import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URIROLE),
    ConfigModule.forRoot({
      isGlobal: true, // Làm cho ConfigModule có sẵn trong toàn bộ ứng dụng
      envFilePath: '.env', // Sử dụng tệp .env từ thư mục gốc của workspace
    }),RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
