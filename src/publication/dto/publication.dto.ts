import { ApiProperty } from '@nestjs/swagger';
import { PublicationStatus } from '../../types/publication-status.js';

export class PublicationDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID публикации',
  })
  _id: string;

  @ApiProperty({
    example: 'Title',
    description: 'Заголовок публикации',
  })
  title: string;

  @ApiProperty({
    example: 'content',
    description: 'Контент публикации',
  })
  content: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID автора',
  })
  authorId: string;

  @ApiProperty({
    enum: PublicationStatus,
    example: PublicationStatus.draft,
    description: 'Статус публикации',
  })
  status: PublicationStatus;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  views: number;

  @ApiProperty({
    example: 2,
    type: Number,
  })
  likes: number;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    type: String,
  })
  updatedAt: string;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    type: String,
  })
  publishedAt: string;
}

// export interface IPublication {
//   _id: string;
//   title: string;
//   content: string;
//   authorId: string;
//   status: PublicationStatus;
//   views: number;
//   likes: number;
//   createdAt: string;
//   updatedAt: string;
//   publishedAt: string;
// }
