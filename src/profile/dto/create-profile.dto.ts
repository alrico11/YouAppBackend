import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateProfileDto {
    @IsString()
    'display-name' : string;

    @IsString()
    gender : string;

    @IsString()
    birthdate : string;

    @IsNumber()
    height : number;

    @IsNumber()
    weight : number;
}
