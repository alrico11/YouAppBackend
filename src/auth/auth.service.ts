import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'
dotenv.config();
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly user: Model<User>,
    private readonly jwtService: JwtService
  ) { }
  async login(login: LoginAuthDto) {
    try {
      const userExist = await this.user.findOne({
        $or: [
          { email: login.email },
          { username: login.email }
        ]
      });
      if (userExist == null) return null;
      const userValid = bcrypt.compare(login.password, userExist.password)
      if (!userValid) return null;
      const payload = { username: userExist.username, sub: userExist._id, };
      const accessToken = this.jwtService.sign(payload);
      return {
        accessToken: accessToken,
      };
    } catch (error) {
      console.log(error)
    }
  }
  static decodeJwtToken(token: string): { username: string, sub: string } {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_KEY);
      const data = {
        username: decoded.username,
        sub: decoded.sub
      };
      return data;
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }
}
