import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PublicationSubcategory } from './subcategory.dto';
import { PublicationCategoryEntity } from 'src/models/publication-category.entity';

@ApiSchema({ name: 'PublicationCategory' })
export class PublicationCategory {
  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  id: string;

  @ApiProperty({
    type: PublicationSubcategory,
    isArray: true,
  })
  subcategories: PublicationSubcategory[];

  @ApiProperty({ type: 'string', example: 'Пример' })
  title: string;

  @ApiProperty({ type: 'string', example: new Date() })
  createdAt: Date;
  @ApiProperty({ type: 'string', example: new Date() })
  updatedAt: Date;

  constructor(entity: PublicationCategoryEntity) {
    this.id = entity.id;
    this.title = entity.title;
    this.subcategories = entity.subcategories;

    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
