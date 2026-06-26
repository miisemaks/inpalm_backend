import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  ESubscribeVariant,
  SubscribeEntity,
} from 'src/models/subscribe.entity';

@ApiSchema({
  name: 'Subscribe',
  description: 'Подписка на Аккаунт (Не оплата)',
})
export class SubscribeDto {
  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  id: string;

  @ApiProperty({ enum: ESubscribeVariant, example: ESubscribeVariant.user })
  variant: ESubscribeVariant;

  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  subscribeId: string;

  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  subscriberId: string;

  @ApiProperty({ type: 'string', example: new Date() })
  createdAt: Date;

  constructor(entity: SubscribeEntity) {
    this.id = entity.id;
    this.variant = entity.variant;
    this.subscribeId = entity.subscribeId;
    this.subscriberId = entity.subscriberId;
    this.createdAt = entity.createdAt;
  }
}
