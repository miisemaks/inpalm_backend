import { ApiProperty } from '@nestjs/swagger';

export class MediaImageCreate {
  @ApiProperty({
    required: true,
    format: 'binary',
  })
  images: Express.Multer.File[];
}
