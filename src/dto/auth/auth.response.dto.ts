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
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlN2FhOWFiLWRiM2YtNDdiZi04OWQyLTUzYTRkNmQwYTM0ZSIsImVtYWlsIjoidGVtcEBtYWlsLnJ1Iiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzgwNDUyNzM5LCJleHAiOjE5MzgyNDA3Mzl9.CRYwDxWJvZovWP2Q-vGXyGKlTEnkYpVZvKcqwsIneno',
  })
  access_token: string;
  @ApiProperty({ type: UserDto })
  user: UserDto;
}
