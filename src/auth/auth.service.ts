import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor( @InjectModel('User') private readonly user: Model<User>) {}
  async login(login: LoginAuthDto) {

    const userExist = await this.user.findOne({
      email : login.email
    })
    if (userExist == null) return null;
    if (login.password !== userExist.password) return null;
    return userExist;
  }
}
