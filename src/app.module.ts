import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { MessageModule } from './message/message.module';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    AuthModule,
    ProfileModule,
    MessageModule,
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'./env'
    })
  ],
  providers: [RabbitMQService],
})
export class AppModule {}