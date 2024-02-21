export class GetProfileDto {
    'display-name' : string;
    gender? : string;
    birthdate? : string;
    height? : number;
    weight? : number;
    horoscope : string;
    zodiac : string;
    pict? : string;
    interest? : string[];
    userId : string;
}
