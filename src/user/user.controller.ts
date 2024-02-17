import { Controller, Get, Post, Body, Patch, Param, Delete, BadGatewayException, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

}
