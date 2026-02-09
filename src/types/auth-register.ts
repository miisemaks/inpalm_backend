import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

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
  @MinLength(6)
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
    required: false,
    type: 'string',
    example: 'Иванов',
    default: '',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    example: 'Иванов',
    default: '',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  birthdate?: string;
}
