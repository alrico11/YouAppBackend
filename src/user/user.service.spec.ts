import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

describe('UserService', () => {
  let userService: UserService;
  let model: Model<User>;
  const mockUserService = {
    createUser: jest.fn(),
  };
  const mockUser = {
    "_id" : "65d03d63adfcce24dd75bedb",
    "email": "jane.doe@example.com",
    "username": "janedoe",
    "password": "$2b$10$/7WIzxNRuEzlnUnsWXYqvejxQDCdBtXDz3j5TkimjtmyWB8NTHrce",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('create user', () => {
    it('should return user data', async () => {
      const createUserDto = {
        email: 'jane.doe@example.com',
        username: 'janedoe',
        password: 'password',
        'confirm-password': 'password',
      };
      const result = await userService.create(createUserDto);
      expect(result).toEqual(mockUser); 
    });
    it('should return "Password and confirm password do not match."', async () => {
      const createUserDto = {
        email: 'jane.doe',
        username: 'janedoe',
        password: "asd",
        'confirm-password': "asss",
      };
      try {
        await userService.create(createUserDto);
        fail("The test should fail because the user creation should fail due to password mismatch.");
      } catch (error) {
        expect(error.message).toEqual("Password and confirm password do not match.");
      }
    });
  });
});
