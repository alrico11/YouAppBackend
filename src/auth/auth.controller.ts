import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() req: LoginAuthDto) {
    let data = this.authService.login(req);
    if(data == null) return new UnauthorizedException("Unauthorized").getResponse()
    return { success: true , data};
  }
}
