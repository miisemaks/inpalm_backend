import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PublicationSubcategoryEntity } from 'src/models/publication-subcategory.entity';
import { PublicationCategory } from './category.dto';

@ApiSchema({ name: 'PublicationSubcategory' })
export class PublicationSubcategory {
  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  id: string;

  @ApiProperty({ type: 'string', example: 'Пример' })
  title: string;

  @ApiProperty({ type: () => PublicationCategory, nullable: true })
  category: PublicationCategory | null;

  @ApiProperty({ type: 'string', example: new Date() })
  createdAt: Date;
  @ApiProperty({ type: 'string', example: new Date() })
  updatedAt: Date;

  constructor(entity: PublicationSubcategoryEntity) {
    this.id = entity.id;
    this.title = entity.title;
    this.category = entity.category;

    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
