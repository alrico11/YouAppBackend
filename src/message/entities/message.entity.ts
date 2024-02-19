import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Message extends Document {
    @Prop()
    from: string
    @Prop()
    content: string
    @Prop()
    to: string
}

export const MessageSchema = SchemaFactory.createForClass(Message);