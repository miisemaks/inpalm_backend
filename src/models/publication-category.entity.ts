import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PublicationSubcategoryEntity } from './publication-subcategory.entity';
import { PublicationEntity } from './publication.entity';

@Entity('publication_categories')
export class PublicationCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @OneToMany(
    () => PublicationSubcategoryEntity,
    (category) => category.category,
  )
  subcategories: PublicationSubcategoryEntity[];

  @OneToMany(() => PublicationEntity, (publication) => publication.category)
  publications: PublicationEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
