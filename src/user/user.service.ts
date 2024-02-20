import {Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.userModel.findOne({
      $or: [{ email: createUserDto.email }, { username: createUserDto.username }],
    });
    if (userExist !== null) return null;

    if (createUserDto.password !== createUserDto['confirm-password']) {
      throw new Error("Password and confirm password do not match.");
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.userModel.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
    });
    return newUser;
  }
}
