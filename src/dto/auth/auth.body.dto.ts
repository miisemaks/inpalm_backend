import { ApiProperty, ApiSchema } from '@nestjs/swagger';

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
  phone: string | null;
}
