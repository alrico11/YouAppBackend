import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from './entities/profile.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserSchema } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema },{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService,AuthService,JwtService],
})
export class ProfileModule {}
