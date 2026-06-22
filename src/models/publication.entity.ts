import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PublicationSubcategoryEntity } from './publication-subcategory.entity';
import { PublicationCategoryEntity } from './publication-category.entity';

export enum EPublicationStatus {
  created = 'created',
  deleted = 'deleted',
  hidden = 'hidden',
  banned = 'banned',
}

@Entity('publications')
export class PublicationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: EPublicationStatus, default: EPublicationStatus.created })
  status: EPublicationStatus;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true, name: 'delete_reason' })
  deleteReason: string | null;

  @ManyToOne(
    () => PublicationCategoryEntity,
    (category) => category.publications,
  )
  @JoinColumn({ name: 'category_id' })
  category: PublicationCategoryEntity;

  @ManyToOne(
    () => PublicationSubcategoryEntity,
    (subcategory) => subcategory.publications,
  )
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: PublicationSubcategoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.publications)
  @JoinColumn({ name: 'user_id' })
  author: UserEntity | null;

  @RelationId((entity: PublicationEntity) => entity.author)
  authorId: string | null;

  @Column({ type: 'int', default: 0 })
  views: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
