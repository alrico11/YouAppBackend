import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Controller('api')
@UseGuards(JwtGuard) 
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
    private readonly authService: AuthService
    ) { }

  @Post('createProfile')
  async create(@Req() req,@Body() createProfileDto: CreateProfileDto) {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await this.authService.decodeJwtToken(token);
    const data = await this.profileService.create(decoded.sub, createProfileDto)
    if( data == null) return new BadRequestException("Cant create profiles").getResponse();
    return { success: true };
  }
  @Get('getProfile')
  async get(@Req() req){
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await this.authService.decodeJwtToken(token);
    const data = await this.profileService.get(decoded.sub) 
    return { success: true, data };
  }
  @Put('updateProfile')
  async update(@Req() req,@Body() dto: UpdateProfileDto){
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await this.authService.decodeJwtToken(token);
    const data = await this.profileService.update(decoded.sub,dto)
    return { success: true };
  }
}
