export class Utils {
    static convertStringToDate(date: string): Date {
        let convertedDate: Date;
        const splitDate = date.split('/');
        const dd = parseInt(splitDate[0]);
        const mm = parseInt(splitDate[1]);
        const yyyy = parseInt(splitDate[2]);
        convertedDate = new Date(Date.UTC(yyyy, mm - 1, dd));

        return convertedDate;
    }

    static setZodiacAndHoroscope(date: string): { zodiac: string, horoscope: string } {
        let splitDate = date.split('/');
        let day = parseInt(splitDate[0]);
        let month = parseInt(splitDate[1]);
        const zodiacSigns = [
            { sign: 'Aries', startDate: new Date(0, 3, 21), endDate: new Date(0, 4, 19) },
            { sign: 'Taurus', startDate: new Date(0, 4, 20), endDate: new Date(0, 5, 20) },
            { sign: 'Gemini', startDate: new Date(0, 5, 21), endDate: new Date(0, 6, 21) },
            { sign: 'Cancer', startDate: new Date(0, 6, 22), endDate: new Date(0, 7, 22) },
            { sign: 'Leo', startDate: new Date(0, 7, 23), endDate: new Date(0, 8, 22) },
            { sign: 'Virgo', startDate: new Date(0, 8, 23), endDate: new Date(0, 9, 22) },
            { sign: 'Libra', startDate: new Date(0, 9, 23), endDate: new Date(0, 10, 23) },
            { sign: 'Scorpio', startDate: new Date(0, 10, 24), endDate: new Date(0, 11, 21) },
            { sign: 'Sagittarius', startDate: new Date(0, 11, 22), endDate: new Date(0, 12, 21) },
            { sign: 'Capricorn', startDate: new Date(0, 12, 22), endDate: new Date(1, 1, 19) },
            { sign: 'Aquarius', startDate: new Date(1, 1, 20), endDate: new Date(1, 2, 18) },
            { sign: 'Pisces', startDate: new Date(1, 2, 19), endDate: new Date(1, 3, 20) }
        ];

        let zodiac = '';
        let horoscope = '';

        zodiacSigns.forEach(sign => {
            if ((month === sign.startDate.getMonth() && day >= sign.startDate.getDate())
                || (month === sign.endDate.getMonth() && day <= sign.endDate.getDate())) {
                zodiac = sign.sign;
                return;
            }
        });
        switch (zodiac) {
            case 'Aries':
                horoscope = 'Ram';
                break;
            case 'Taurus':
                horoscope = 'Bull';
                break;
            case 'Gemini':
                horoscope = 'Twins';
                break;
            case 'Cancer':
                horoscope = 'Crab';
                break;
            case 'Leo':
                horoscope = 'Lion';
                break;
            case 'Virgo':
                horoscope = 'Virgin';
                break;
            case 'Libra':
                horoscope = 'Balance';
                break;
            case 'Scorpio':
                horoscope = 'Scorpion';
                break;
            case 'Sagittarius':
                horoscope = 'Archer';
                break;
            case 'Capricorn':
                horoscope = 'Goat';
                break;
            case 'Aquarius':
                horoscope = 'Water Bearer';
                break;
            case 'Pisces':
                horoscope = 'Fish';
                break;
            default:
                horoscope = '';
        }

        return { zodiac, horoscope };
    }
    static convertDateToDdMmYyyy(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month index starts from 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

}