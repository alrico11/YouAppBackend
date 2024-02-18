import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { Utils } from 'utils/utils'; // Assuming Utils class is defined properly
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetProfileDto } from './dto/get-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectModel('Profile') private readonly profile: Model<Profile>) { }

  async create(userId: string, createProfileDto: CreateProfileDto) {
    let data = await this.profile.findOne({ userId: userId })
    if (data != null) {
      throw new ForbiddenException("Cant create profiles");
    }
    const profile = new this.profile();
    profile['display-name'] = createProfileDto['display-name'];
    profile.gender = createProfileDto.gender === 'male';
    profile.birthdate = Utils.convertStringToDate(createProfileDto.birthdate);
    const zodiacAndHoroscope = Utils.setZodiacAndHoroscope(createProfileDto.birthdate);
    profile.horoscope = zodiacAndHoroscope.horoscope;
    profile.zodiac = zodiacAndHoroscope.zodiac;
    profile.height = createProfileDto.height;
    profile.weight = createProfileDto.weight;
    profile.userId = userId;
    profile.save();
    return profile;
  }
  async get(userId: string): Promise<GetProfileDto> {
    let data = await this.profile.findOne({ userId: userId })
    if (data == null) throw new NotFoundException("Not Found")
    let profile = new GetProfileDto
    profile.userId = userId;
    profile['display-name'] = data['display-name']
    profile.birthdate = Utils.convertDateToDdMmYyyy(data.birthdate);
    profile.gender = data.gender == true ? "male" : "female";
    profile.horoscope = data.horoscope;
    profile.zodiac = data.zodiac;
    profile.height = data.height;
    profile.weight = data.weight;
    return profile;
  }
  async update(userId: string, req: UpdateProfileDto) {
    let profile = await this.profile.findOneAndUpdate({ userId: userId })
    if (profile == null) throw new NotFoundException("Not Found")
    profile.userId = userId;
    profile['display-name'] = req['display-name']
    profile.birthdate = Utils.convertStringToDate(req.birthdate);
    profile.gender = req.gender == "male" ? true : false;
    const zodiacAndHoroscope = Utils.setZodiacAndHoroscope(req.birthdate);
    profile.horoscope = zodiacAndHoroscope.horoscope;
    profile.zodiac = zodiacAndHoroscope.zodiac;
    profile.horoscope = zodiacAndHoroscope.horoscope;
    profile.zodiac = zodiacAndHoroscope.zodiac;
    profile.height = req.height;
    profile.weight = req.weight;
    profile.save();
    return profile;
  }
}
