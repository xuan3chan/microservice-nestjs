import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URIADMIN), // Use MongooseModule
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
