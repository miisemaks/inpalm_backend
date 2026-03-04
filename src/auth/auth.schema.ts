import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema({
  timestamps: true,
})
export class Auth {
  @Prop({ type: String, required: true, unique: true })
  userId: string;

  @Prop({
    required: true,
    trim: true,
  })
  password: string;

  @Prop({
    default: [],
  })
  refreshTokens: string[];

  @Prop()
  passwordChangedAt: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpires: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
