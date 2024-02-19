import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop()
    email : string;
    @Prop()
    username : string
    @Prop()
    password : string;
}

export const UserSchema = SchemaFactory.createForClass(User);
