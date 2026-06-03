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
