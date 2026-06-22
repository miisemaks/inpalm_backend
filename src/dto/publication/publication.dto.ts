import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  EPublicationStatus,
  PublicationEntity,
} from 'src/models/publication.entity';
import { UserEntity } from 'src/models/user.entity';
import { PublicationCategory } from './category.dto';
import { PublicationSubcategory } from './subcategory.dto';

@ApiSchema({ name: 'PublicationDto' })
export class PublicationDto {
  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  id: string;

  @ApiProperty({
    enum: EPublicationStatus,
    default: EPublicationStatus.created,
  })
  status: EPublicationStatus;

  @ApiProperty({
    type: () => PublicationCategory,
    nullable: true,
  })
  category: PublicationCategory;

  @ApiProperty({
    type: () => PublicationSubcategory,
    nullable: true,
  })
  subcategory: PublicationSubcategory;

  @ApiProperty({
    type: 'string',
    nullable: true,
    example: 'Текст причины удаления',
  })
  deleteReason: string | null;

  @ApiProperty({
    type: 'boolean',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({ type: 'string', example: 'Пример' })
  title: string;

  @ApiProperty({ type: 'string', example: 'Тело публикации' })
  content: string;

  @ApiProperty({ type: 'number', example: 1 })
  views: number;

  @ApiProperty({ type: UserEntity, nullable: true })
  author: UserEntity | null;

  @ApiProperty({ type: 'string', example: new Date() })
  createdAt: Date;
  @ApiProperty({ type: 'string', example: new Date() })
  updatedAt: Date;

  constructor(entity: PublicationEntity) {
    this.id = entity.id;
    this.status = entity.status;
    this.title = entity.title;
    this.content = entity.content;
    this.views = entity.views;
    this.author = entity.author;
    this.category = new PublicationCategory(entity.category);
    this.subcategory = new PublicationSubcategory(entity.subcategory);

    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
