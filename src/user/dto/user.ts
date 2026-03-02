import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../types/user-role.js';

export class UserDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID пользователя',
  })
  _id: string;

  @ApiProperty({
    example: 'example@mail.ru',
    description: 'Электронная почта',
  })
  email: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
    required: false,
  })
  firstName: string | null;

  @ApiProperty({
    example: 'Иванов',
    description: 'Фамилия пользователя',
    required: false,
  })
  lastName: string | null;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Дата рождения',
    required: false,
  })
  birthdate: string | null;

  @ApiProperty({
    example: UserRole.customer,
    enum: UserRole,
    description: 'Роль пользователя в сервисе',
  })
  role: UserRole;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Аватар URL',
    nullable: true,
  })
  avatar: string | null;
}
