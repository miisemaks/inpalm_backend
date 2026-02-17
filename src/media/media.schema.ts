import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { MediaType } from './type/media-type';

export type MediaDocument = Media & Document;

@Schema()
export class Media {
  @ApiProperty({
    required: true,
    description: 'Ссылка на источник',
    type: 'string',
  })
  @Prop({
    required: true,
    unique: true,
  })
  url: string;

  @ApiProperty({
    description: 'Дата создания',
    type: 'string',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Идентификатор пользователя',
  })
  @Prop({
    required: true,
  })
  author: string;

  @ApiProperty({
    description: 'Тип медиа',
    enum: MediaType,
  })
  @Prop({
    enum: MediaType,
  })
  type: 'image' | 'video';
}

export const MediaSchema = SchemaFactory.createForClass(Media);
