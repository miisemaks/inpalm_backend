import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PublicationCategoryEntity } from './publication-category.entity';
import { PublicationEntity } from './publication.entity';

@Entity('publication_subcategories')
export class PublicationSubcategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @ManyToOne(() => PublicationCategoryEntity, (user) => user.subcategories)
  @JoinColumn({ name: 'category_id' })
  category: PublicationCategoryEntity | null;

  @OneToMany(() => PublicationEntity, (publication) => publication.subcategory)
  publications: PublicationEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
