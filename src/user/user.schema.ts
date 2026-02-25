import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole } from 'src/types/user-role';

export type UserDocument = User & Document;

@Schema({})
export class User {
  @ApiProperty({
    required: true,
    description: 'Идентификатор пользователя',
    type: 'string',
    example: '6982fccfc36f4c3d5cda354d',
  })
  id: string;

  @ApiProperty({
    required: true,
    description: 'Электронная почта',
    type: 'string',
    example: 'temp@mail.ru',
  })
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    required: false,
    example: 'Иван',
  })
  @Prop({
    required: true,
    trim: true,
  })
  firstName: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    required: false,
    example: 'Иванов',
    type: 'string',
  })
  @Prop({
    required: false,
    trim: true,
    type: String,
    name: 'lastName',
  })
  lastName: string;

  @ApiProperty({
    description: 'Дата рождения',
    required: false,
    example: '1995-06-15T00:00:00.000Z',
    type: 'string',
  })
  @Prop({
    required: false,
    type: String,
    trim: true,
    name: 'birthdate',
  })
  birthdate: string;

  @ApiProperty({
    description: 'Роль пользователя',
    required: false,
    type: 'string',
    enum: UserRole,
    example: UserRole.customer,
    default: UserRole.customer,
  })
  @Prop({
    required: false,
    default: UserRole.customer,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Аватар пользователя',
    required: false,
    nullable: true,
    default: null,
  })
  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Media',
    default: null,
  })
  avatar: MongooseSchema.Types.ObjectId | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
