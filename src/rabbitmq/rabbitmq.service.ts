import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Message } from 'src/message/entities/message.entity';
import * as dotenv from 'dotenv';
dotenv.config()

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(`${process.env.RABBITMQ_HOST}`);
      this.channel = await this.connection.createConfirmChannel();
      const exchangeName = 'messages_exchange';
      await this.channel.assertExchange(exchangeName, 'direct', { durable: true });
    } catch (error) {
      throw new Error(`Failed to connect to RabbitMQ: ${error}`);
    }
  }

  async sendMessage(message: any): Promise<void> {
    try {
      const exchangeName = 'messages_exchange';
      this.channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)));
    } catch (error) {
      throw new Error(`Failed to send message to RabbitMQ: ${error}`);
    }
  }

  async closeConnection(): Promise<void> {
    try {
      await this.channel.close();
      await this.connection.close();
    } catch (error) {
      throw new Error(`Failed to close RabbitMQ connection: ${error}`);
    }
  }

  async sendViewedMessages(messages: Message[]): Promise<void> {
    try {
      const exchangeName = 'viewed_messages_exchange';
      await this.channel.assertExchange(exchangeName, 'direct', { durable: true });
      for (const message of messages) {
        this.channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)));
      }
    } catch (error) {
      throw new Error(`Failed to send messages to exchange: ${error}`);
    }
  }

  async consumeMessages(queueName: string, callback: (message: amqp.Message) => void): Promise<void> {
    try {
      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.bindQueue(queueName, 'messages_exchange', '');
      this.channel.consume(queueName, (message) => {
        if (message !== null) {
          callback(message);
          this.channel.ack(message);
        }
      });
    } catch (error) {
      throw new Error(`Failed to consume messages from queue: ${error}`);
    }
  }
}
