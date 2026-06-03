import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber } from 'class-validator';

@ApiSchema({
  name: 'AuthGetCodeBodyDto',
})
export class AuthGetCodeBodyDto {
  @ApiProperty({
    type: 'string',
    example: 'temp@mail.ru',
  })
  email: string;
}

@ApiSchema({
  name: 'AuthVerifyCodeBodyDto',
})
export class AuthVerifyCodeBodyDto {
  @ApiProperty({
    type: 'string',
    example: 'temp@mail.ru',
  })
  email: string;
  @ApiProperty({
    type: 'string',
    example: '1234',
  })
  code: string;
}

@ApiSchema({
  name: 'AuthRegisterBodyDto',
})
export class AuthRegisterBodyDto {
  @ApiProperty({
    type: 'string',
    example: 'temp@mail.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'Иван',
  })
  firstName: string | null;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'Иванов',
  })
  lastName: string | null;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: '+7 (000) 000-00-00',
  })
  @IsPhoneNumber('RU')
  phone: string | null;
}

@ApiSchema({ name: 'AuthSendCodeNewEmailBodyDto' })
export class AuthSendCodeNewEmailBodyDto {
  @ApiProperty({
    type: 'string',
  })
  @IsEmail()
  newEmail: string;
}

@ApiSchema({ name: 'AuthVerifyCodeNewEmailBodyDto' })
export class AuthVerifyCodeNewEmailBodyDto {
  @ApiProperty({
    type: 'string',
  })
  @IsEmail()
  newEmail: string;

  @ApiProperty({
    type: 'string',
  })
  code: string;
}
