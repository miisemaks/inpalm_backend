import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { UserRole } from 'src/types/user-role';

export class CreateUser {
  @ApiProperty({
    required: true,
    default: 'temp@mail.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    example: 'Иван',
    default: null,
    description: 'Имя пользователя',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    required: false,
    example: 'Иванов',
    default: null,
    description: 'Фамилия пользователя',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    required: false,
    example: '1995-06-15T00:00:00.000Z',
    default: null,
    description: 'Дата рождения пользователя',
  })
  @IsString()
  birthdate: string;

  @ApiProperty({
    required: false,
    example: UserRole.customer,
    default: UserRole.customer,
    description: 'Роль пользователя',
    enum: UserRole,
  })
  @IsString()
  role: UserRole;
}
