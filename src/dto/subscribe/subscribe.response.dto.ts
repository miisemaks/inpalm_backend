import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { SubscribeDto } from './subscribe.dto';

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
