import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
describe('UserService', () => {
  let service: UserService;
  let mockUserModel;
  beforeEach(async () => {
    mockUserModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndRemove: jest.fn(),
      create: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
