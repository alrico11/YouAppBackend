// message.service.ts

import { Injectable } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private readonly message : Model<Message>,
    private readonly rabbitMQService: RabbitMQService
    ) {}

    async sendMessage(senderId: string, dto: CreateMessageDto) {
      try {
        let data = {
          from : senderId,
          to : dto.to,
          content : dto.content 
        };
        await this.message.create(data)
        await this.rabbitMQService.connect(); 
        await this.rabbitMQService.sendMessage(data);
        return data;
      } catch (error) {
        throw new Error(`Failed to send message: ${error}`);
      } finally {
        await this.rabbitMQService.closeConnection();
      }
    }
    async viewMessageByUserId(userId: string): Promise<Message[]> {
      try {
        const messages = await this.message.find({ to: userId }).exec();
        console.log(userId)
        console.log(messages)
        await this.rabbitMQService.connect();
        await this.rabbitMQService.sendViewedMessages(messages);
        await this.rabbitMQService.closeConnection();
        return messages;
      } catch (error) {
        throw new Error(`Failed to get and send messages for user: ${error}`);
      }
    }
    
}
