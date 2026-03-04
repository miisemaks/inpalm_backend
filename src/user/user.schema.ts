import { model, Schema, HydratedDocument } from 'mongoose';
import { UserRole } from '../types/user-role.js';

export type UserDocument = HydratedDocument<IUser>;

export interface IUser {
  _id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  birthdate: string | null;
  role: UserRole;
  avatar: string | null;
}

export const UserSchema = new Schema<IUser>(
  {
    email: { type: 'String', required: true },
    firstName: { type: 'String', required: false, default: null },
    lastName: { type: 'String', required: false, default: null },
    birthdate: { type: 'String', required: false, default: null },
    role: {
      type: 'String',
      enum: UserRole,
      required: false,
      default: UserRole.customer,
    },
    avatar: { type: 'String', required: false, default: null },
  },
  { timestamps: true, collection: 'users' },
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

export const User = model<IUser>('User', UserSchema);
