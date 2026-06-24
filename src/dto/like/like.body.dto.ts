import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { ELikeVariant } from 'src/models/like.entity';

@ApiSchema({ name: 'LikeCreateBody' })
export class LikeCreateBodyDto {
  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  id: string;

  @ApiProperty({
    enum: ELikeVariant,
    example: ELikeVariant.publication,
  })
  variant: ELikeVariant;
}
