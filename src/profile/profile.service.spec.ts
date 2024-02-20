import { NotFoundException } from "@nestjs/common";
import { Utils } from '../../utils/utils'; 
import { ProfileService } from "./profile.service";
import { Profile } from "./entities/profile.entity";
import { Model } from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
describe('ProfileService', () => {
  let service: ProfileService;
  let model: Model<Profile>;
  let mock = {
    "_id": "65d19b4fd7e8a8be1539b2e0",
    "display-name": "Jane Doe",
    "gender": false,
    "birthdate": "2001-02-01T00:00:00.000Z",
    "horoscope": "Water Bearer",
    "zodiac": "Aquarius",
    "height": 180,
    "weight": 75,
    "userId": "65d361e13a925ea71f1c214b",
    "pict": "/9j/4AAQSkZJRgABAQAAZABkAAD/2wCEABQQEBkSGScXFycyJh8mMi4mJiYmLj41NTU1NT5EQUFBQUFBREREREREREREREREREREREREREREREREREREREQBFRkZIBwgJhgYJjYm"
  }
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ProfileService,
      {
        provide: getModelToken(Profile.name),
        useValue: {
          findOne: jest.fn().mockImplementation((query) => {
            if (query.userId === mock.userId) {
              return mock; 
            } else {
              return null; 
            }
          }),
          create: jest.fn().mockResolvedValue(mock), 
          findOneAndUpdate: jest.fn().mockImplementation((query) => {
            if (query.userId === mock.userId) {
              return mock;
            } else {
              return null; 
            }
          }),
        },
      },
    ],
  }).compile();

  service = module.get<ProfileService>(ProfileService);
  model = module.get<Model<Profile>>(getModelToken(Profile.name));
});

it('should return user profile data', async () => {
  const userId = "65d361e13a925ea71f1c214b"
  const res = await service.get(userId);
  expect(res).toEqual(expect.objectContaining({
    userId: mock.userId,
    'display-name': mock['display-name'],
    birthdate: '01/02/2001',
    gender: 'female',
    horoscope: mock.horoscope,
    zodiac: mock.zodiac,
    height: mock.height,
    weight: mock.weight,
    pict: mock.pict,
  }));
});

it('should return updated user data', async () => {
  const dto = {
    "display-name": "Alrico Rizki Wibowo",
    "gender": "female",
    "birthdate": "29/03/2001",
    "height": 188,
    "weight": 90,
    "pict": "/9j/4AAQSkZJRgABAQAAZABkAAD/2wCEABQQEBkSGScXFycyJh8mMi4mJiYmLj41NTU1NT5EQUFBQUFBREREREREREREREREREREREREREREREREREREREQBFRkZIBwgJhgYJjYm"
  }
  const userId = "65d361e13a925ea71f1c214b"
  const res = await service.update(userId, dto);
  expect(res).toEqual(expect.objectContaining({
    userId: mock.userId,
    'display-name': dto['display-name'],
    birthdate: Utils.convertStringToDate(dto.birthdate),
    gender: false,
    horoscope: Utils.setZodiacAndHoroscope(dto.birthdate).horoscope,
    zodiac: Utils.setZodiacAndHoroscope(dto.birthdate).zodiac,
    height: dto.height,
    weight: dto.weight,
    pict: mock.pict,
  }));
});


it('should return user data', async () => {
  const dto = {
    "display-name": "Jane Doe",
    "gender": "female",
    "birthdate": "01/02/2001",
    "height": 180,
    "weight": 75,
    "pict": "/9j/4AAQSkZJRgABAQAAZABkAAD/2wCEABQQEBkSGScXFycyJh8mMi4mJiYmLj41NTU1NT5EQUFBQUFBREREREREREREREREREREREREREREREREREREREQBFRkZIBwgJhgYJjYm"
  }
  service['profile'].findOne = jest.fn().mockResolvedValue(null);
  const userId = "65d361e13a925ea71f1c214b"
  const res = await service.create(userId, dto);
  expect(res).toEqual(mock); 
});

  describe('get profile', () => {
    it('should return user profile data', async () => {
      const userId = "65d361e13a925ea71f1c214b"
      const res = await service.get(userId);
      expect(res).toEqual(expect.objectContaining({
        userId: mock.userId,
        'display-name': mock['display-name'],
        birthdate: '01/02/2001',
        gender: 'female',
        horoscope: mock.horoscope,
        zodiac: mock.zodiac,
        height: mock.height,
        weight: mock.weight,
        pict: mock.pict,
      }));
    });

    it('should throw NotFoundException if profile is not found', async () => {
      const userId = "nonexistentuserid"
      service['profile'].findOne = jest.fn().mockResolvedValue(null);
      await expect(service.get(userId)).rejects.toThrowError(NotFoundException);
    });
    
  });

  describe('update profile', () => {
    it('should return updated user data', async () => {
      const dto = {
        "display-name": "Updated Name",
        "gender": "male",
        "birthdate": "01/02/2001",
        "height": 170,
        "weight": 70,
        "pict": "/updated/picture/url"
      }
      const userId = "65d361e13a925ea71f1c214b"
      const res = await service.update(userId, dto);
      expect(res).toEqual(expect.objectContaining({
        userId: mock.userId,
        'display-name': dto['display-name'],
        birthdate: Utils.convertStringToDate(dto.birthdate),
        gender: true,
        horoscope: mock.horoscope, 
        zodiac: mock.zodiac,
        height: dto.height,
        weight: dto.weight,
        pict: dto.pict,
      }));
    });

    it('should throw NotFoundException if profile is not found', async () => {
      const dto = {
        "display-name": "Updated Name",
        "gender": "male",
        "birthdate": "01/02/2001",
        "height": 170,
        "weight": 70,
        "pict": "/updated/picture/url"
      }
      const userId = "nonexistentuserid"
      await expect(service.update(userId, dto)).rejects.toThrowError(NotFoundException);
    });
  });
});
