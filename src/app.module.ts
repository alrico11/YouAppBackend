import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
dotenv.config()
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}