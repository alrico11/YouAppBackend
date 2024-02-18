import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import { MessageController } from './message/message.controller';
import * as dotenv from 'dotenv';
dotenv.config()
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    AuthModule,
    ProfileModule,
  ],
  providers: [RabbitmqService],
  controllers: [MessageController],
})
export class AppModule {}