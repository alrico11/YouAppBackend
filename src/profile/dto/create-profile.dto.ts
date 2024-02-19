import { IsString, IsNumber, IsBase64 } from 'class-validator';

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
    @IsBase64()
    pict : string
}
