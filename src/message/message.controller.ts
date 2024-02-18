// message.controller.ts

import { Controller, Post, Body, Req, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('api')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('sendMessage')
  async sendMessage(@Body() dto : CreateMessageDto, @Req() req: Request){
    try {
      const token = req.headers.authorization.split(' ')[1];
      const senderId = AuthService.decodeJwtToken(token);
      await this.messageService.sendMessage(senderId, dto);
      return dto;
    } catch (error) {
      throw new Error(`error : ${error}`);
    }
  }
  @Get('viewMessages/')
  async viewMessages( @Req() req: Request) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const senderId = AuthService.decodeJwtToken(token);
      const messages = await this.messageService.viewMessageByUserId(senderId);
      return { success: true, messages };
    } catch (error) {
      throw new Error(`Error viewing messages: ${error}`);
    }
  }
}
