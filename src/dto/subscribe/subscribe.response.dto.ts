import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { SubscribeDto } from './subscribe.dto';
import { UserBasicDto } from '../user/user.dto';

@ApiSchema({ name: 'SubscribeResponse' })
export class SubscribeResponseDto {
  @ApiProperty({ type: SubscribeDto })
  data: SubscribeDto;
}

@ApiSchema({ name: 'SubscribeResponseList' })
export class SubscribeResponseListDto {
  @ApiProperty({ type: [SubscribeDto] })
  data: SubscribeDto[];
}

@ApiSchema({ name: 'SubscribeUserResponseList' })
export class SubscribeUserResponseListDto {
  @ApiProperty({ type: [SubscribeDto] })
  data: UserBasicDto[];
}
