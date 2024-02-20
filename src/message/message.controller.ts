// message.controller.ts

import { Controller, Post, Body, Req, Get, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('api')
@UseGuards(JwtGuard) 
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly authservice: AuthService
    ) {}

  @Post('sendMessage')
  async sendMessage(@Body() dto : CreateMessageDto, @Req() req: Request){
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = await this.authservice.decodeJwtToken(token);
      await this.messageService.sendMessage(decoded.username, dto);
      return { success: true };
    } catch (error) {
      throw new Error(`error : ${error}`);
    }
  }
  @Get('viewMessages/')
  async viewMessages( @Req() req: Request) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = await this.authservice.decodeJwtToken(token);
      const data = await this.messageService.viewMessageByUserId(decoded.username);
      return { success: true, data };
    } catch (error) {
      throw new Error(`Error viewing messages: ${error}`);
    }
  }
}
