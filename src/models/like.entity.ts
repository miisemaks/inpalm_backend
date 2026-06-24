import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ELikeVariant {
  publication = 'publication',
}

@Entity('likes')
export class LikeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'variant', enum: ELikeVariant })
  variant: ELikeVariant;

  @Column({ name: 'model_id', type: 'varchar' })
  modelId: string;

  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
