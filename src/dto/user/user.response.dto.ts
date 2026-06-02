import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { UserDto } from './user.dto';
@ApiSchema({ name: 'UserListResponseDto' })
export class UserListResponseDto {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}
@ApiSchema({ name: 'UserResponseDto' })
export class UserResponseDto {
  @ApiProperty({ type: UserDto })
  data: UserDto;
}
