import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
   async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      if (!user) {
        return { message: 'User already exists.' };
      }
      return { message: 'User created successfully.', user };
    } catch (error) {
      return { message: 'Failed to create user.', error: error.message };
    }
  }
}
