import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Utils } from '../../utils/utils'; 
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetProfileDto } from './dto/get-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private readonly profile: Model<Profile>) { }
  async create(userId: string, req: CreateProfileDto) {
    try {
      let data = await this.profile.findOne({ userId: userId }) // Gunakan model Profile
      if (data != null) {
        throw new ForbiddenException("Can't create profiles");
      }
      const zodiacAndHoroscope = Utils.setZodiacAndHoroscope(req.birthdate);
      const newProfile = await this.profile.create({
        ['display-name']: req['display-name'],
        gender: req.gender === 'male',
        birthdate: Utils.convertStringToDate(req.birthdate),
        horoscope:zodiacAndHoroscope.horoscope,
        zodiac:zodiacAndHoroscope.zodiac,
        height:req.height,
        weight:req.weight,
        userId:userId,
        pict:req.pict,
      });
      return newProfile;
    } catch (error) {
      throw error;
    }
  }
  
  async get(userId: string): Promise<GetProfileDto> {
    let data = await this.profile.findOne({ userId: userId });
    if (data == null) {
      throw new NotFoundException("Profile not found"); // Lebih baik melemparkan pengecualian daripada mengembalikan null
    }
    let profile = new GetProfileDto();
    profile.userId = userId;
    profile['display-name'] = data['display-name'];
    profile.birthdate = Utils.convertDateToDdMmYyyy(data.birthdate);
    profile.gender = data.gender == true ? "male" : "female";
    profile.horoscope = data.horoscope;
    profile.zodiac = data.zodiac;
    profile.height = data.height;
    profile.weight = data.weight;
    profile.pict = data.pict;
    return profile;
  }
  
  async update(userId: string, req: UpdateProfileDto) {
    try {
      const update = {
        userId: userId,
        'display-name': req['display-name'],
        birthdate: Utils.convertStringToDate(req.birthdate),
        gender: req.gender == "male" ? true : false,
        ...Utils.setZodiacAndHoroscope(req.birthdate), // Gunakan spread operator untuk menggabungkan properti dari setZodiacAndHoroscope
        height: req.height,
        weight: req.weight,
        pict: req.pict,
      };
  
      let profile = await this.profile.findOneAndUpdate({ userId: userId }, { $set: update }, { new: true });
      if (!profile) throw new NotFoundException("Not Found");
  
      return update;
    } catch (error) {
      throw error;
    }
  }
}
