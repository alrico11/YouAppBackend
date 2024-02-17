import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() req: LoginAuthDto) {
    let data = this.authService.login(req);
    return  data == null ? data : new UnauthorizedException("Unauthorized").getResponse();
  }
}
