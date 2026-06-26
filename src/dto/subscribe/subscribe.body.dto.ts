import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { ESubscribeVariant } from 'src/models/subscribe.entity';

@ApiSchema({ name: 'SubscribeCreateBody' })
export class SubscribeCreateBodyDto {
  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  subscribeId: string;

  @ApiProperty({
    enum: ESubscribeVariant,
    example: ESubscribeVariant.user,
  })
  variant: ESubscribeVariant;
}
