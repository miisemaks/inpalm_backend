import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthRegister {
  @ApiProperty({
    required: true,
    example: 'temp@mail.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: '123456',
    default: '',
  })
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
    type: 'string',
    example: 'Иван',
    default: '',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    required: true,
    type: 'string',
    example: 'Иван',
    default: '',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    required: true,
    type: 'string',
    example: 'Иванов',
    default: '',
  })
  @IsString()
  birthdate: string;
}
