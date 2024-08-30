import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  [x: string]: any;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  firstname: string;
  
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  lastname: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  account: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  password: string;

}
export const UserSchema = SchemaFactory.createForClass(User);
