import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { ELikeVariant, LikeEntity } from 'src/models/like.entity';

@ApiSchema({ name: 'Like' })
export class LikeDto {
  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  id: string;

  @ApiProperty({ enum: ELikeVariant, example: ELikeVariant.publication })
  variant: ELikeVariant;

  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  modelId: string;

  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  userId: string;

  @ApiProperty({ type: 'string', example: new Date() })
  createdAt: Date;

  constructor(entity: LikeEntity) {
    this.id = entity.id;
    this.variant = entity.variant;
    this.modelId = entity.modelId;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
  }
}
