import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Profile extends Document {
    @Prop()
    "display-name": string;
    @Prop()
    gender: boolean;
    @Prop()
    birthdate: Date;
    @Prop()
    horoscope: string;
    @Prop()
    zodiac: string;
    @Prop()
    height: number;
    @Prop()
    weight: number;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userId: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
