import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { MessageSchema } from './entities/message.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UserSchema } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema },{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [MessageController],
  providers: [MessageService,RabbitMQService,AuthService,JwtService],
})
export class MessageModule {}
