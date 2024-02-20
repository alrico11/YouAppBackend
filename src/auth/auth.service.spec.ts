import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('Auth Service', () => {
    let authService: AuthService;
    let jwtService: JwtService;
    let userModel: any;

    const mockUserModel = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mockToken')
                    }
                }
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        userModel = module.get(getModelToken(User.name));
    });

    it('should return token on successful login', async () => {
        const mockLoginDto = {
            email: 'jane.doe@example.com',
            password: 'password',
        };

        const mockUser = {
            _id: '65d03d63adfcce24dd75bedb',
            username: 'janedoe',
            password: await bcrypt.hash('password', 10),
        };

        mockUserModel.findOne.mockResolvedValue(mockUser);

        const spyJwtSign = jest.spyOn(jwtService, 'sign');

        const result = await authService.login(mockLoginDto);

        expect(result.accessToken).toBeDefined();
        expect(spyJwtSign).toHaveBeenCalled();
    });

    it('should return null on invalid email or password', async () => {
        const mockLoginDto = {
            email: 'jane.doe@example.com',
            password: 'wrongpassword',
        };

        mockUserModel.findOne.mockResolvedValue(null);

        const result = await authService.login(mockLoginDto);

        expect(result).toBeNull();
    });
    
});
