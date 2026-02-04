import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthLogin {
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
}
