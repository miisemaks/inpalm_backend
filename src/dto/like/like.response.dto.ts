import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { LikeDto } from './like.dto';
import { UserBasicDto } from '../user/user.dto';

@ApiSchema({ name: 'LikeResponse' })
export class LikeResponseDto {
  @ApiProperty({ type: LikeDto })
  data: LikeDto;
}

@ApiSchema({ name: 'LikeResponseList' })
export class LikeResponseListDto {
  @ApiProperty({ type: [LikeDto] })
  data: LikeDto[];
}

@ApiSchema({ name: 'LikePublicationResponseList' })
export class LikePublicationResponseListDto {
  @ApiProperty({ type: [UserBasicDto] })
  data: UserBasicDto[];
}
