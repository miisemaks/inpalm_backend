import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type PublicationDocument = Publication & Document;

@Schema({})
export class Publication {
  @ApiProperty({
    required: true,
    description: 'Идентификатор публикации',
    type: 'string',
    example: '6982fccfc36f4c3d5cda354d',
  })
  id: string;

  @ApiProperty({
    required: true,
    description: 'Заголовок публикации',
    type: 'string',
    example: 'Title',
  })
  title: string;

  @ApiProperty({
    description: 'Содержание',
  })
  content: string;

  @ApiProperty({
    description: 'ID автора публикации',
  })
  authorId: string;

  @ApiProperty({
    description: 'Статус публикации',
    enum: ['draft', 'published', 'archived', 'removed'],
  })
  status: 'draft' | 'published' | 'archived' | 'removed';

  @ApiProperty({
    description: 'Количество просмотров',
  })
  views: number;

  @ApiProperty({
    description: 'Количество лайков',
  })
  likes: number;

  @ApiProperty({
    description: 'Дата создания',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата обновления',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Дата публикации',
  })
  publishedAt: string;
}

export const PublicationSchema = SchemaFactory.createForClass(Publication);
