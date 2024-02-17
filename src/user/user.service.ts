import {Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
  @InjectModel('User') private readonly user: Model<User>) { }

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.user.findOne({email : createUserDto.email});
    if (userExist !== null) return null;
  
    if (createUserDto.password !== createUserDto['confirm-password']) {
      throw new Error("Password and confirm password do not match.");
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = {
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword
    };
  
    const data = this.user.create(user);
    return data;
  }


  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

}
