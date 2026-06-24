import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { UserBasicDto, UserDto } from './user.dto';
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

@ApiSchema({
  name: 'UserBasicListResponse',
})
export class UserBasicListResponseDto {
  @ApiProperty({
    type: [UserBasicDto],
  })
  data: UserBasicDto[];
}

@ApiSchema({ name: 'UserBasicResponse' })
export class UserBasicResponse {
  @ApiProperty({
    type: UserBasicDto,
  })
  data: UserBasicDto;
}
