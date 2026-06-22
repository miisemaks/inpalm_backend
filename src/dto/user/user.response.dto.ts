import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { UserDto } from './user.dto';
@ApiSchema({ name: 'UserListResponse' })
export class UserListResponseDto {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}
@ApiSchema({ name: 'UserResponse' })
export class UserResponseDto {
  @ApiProperty({ type: UserDto })
  data: UserDto;
}
