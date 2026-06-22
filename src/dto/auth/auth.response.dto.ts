import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { UserDto } from '../user/user.dto';

@ApiSchema({
  name: 'AuthGetCodeResponse',
})
export class AuthGetCodeResponseDto {
  @ApiProperty({
    type: 'string',
    example: '2026-06-03T02:10:52.846Z',
  })
  expires: string;
}

@ApiSchema({
  name: 'AuthVerifyCodeResponse',
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
  name: 'AuthRegisterResponse',
})
export class AuthRegisterResponseDto {
  @ApiProperty({
    type: 'string',
  })
  expires: string;
}

@ApiSchema({ name: 'AuthSendCodeNewEmailResponse' })
export class AuthSendCodeNewEmailResponseDto {
  @ApiProperty({
    type: 'string',
  })
  expires: string;
}

@ApiSchema({ name: 'AuthVerifyCodeNewEmailResponse' })
export class AuthVerifyCodeNewEmailResponseDto {
  @ApiProperty({
    type: 'string',
  })
  accessToken: string;

  @ApiProperty({
    type: 'string',
  })
  token: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

@ApiSchema({ name: 'AuthLogoutResponse' })
export class AuthLogoutResponseDto {
  @ApiProperty({
    type: 'boolean',
  })
  status: boolean;
}
