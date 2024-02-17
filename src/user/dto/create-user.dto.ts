import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email  : string;
    @IsString()
    @IsNotEmpty()
    username : string;
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: "Minimum length of password is 6" })
    password : string;
    @IsString()
    @IsNotEmpty()
    'confirm-password' : string;
}
