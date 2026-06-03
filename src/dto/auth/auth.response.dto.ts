import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { UserDto } from '../user/user.dto';

@ApiSchema({
  name: 'AuthGetCodeResponseDto',
})
export class AuthGetCodeResponseDto {
  @ApiProperty({
    type: 'string',
    example: '2026-06-03T02:10:52.846Z',
  })
  expires: string;
}

@ApiSchema({
  name: 'AuthVerifyCodeResponseDto',
})
export class AuthVerifyCodeResponseDto {
  @ApiProperty({
    type: 'string',
    example: 'access_token',
  })
  access_token: string;

  @ApiProperty({ type: 'string' })
  refresh_token: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

@ApiSchema({
  name: 'AuthRegisterResponseDto',
})
export class AuthRegisterResponseDto {
  @ApiProperty({
    type: 'string',
  })
  expires: string;
}
