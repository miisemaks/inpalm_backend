import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ESubscribeVariant {
  user = 'user',
}

@Entity('subscribes')
export class SubscribeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'variant', enum: ESubscribeVariant })
  variant: ESubscribeVariant;

  @Column({ name: 'subscribe_id', type: 'varchar' })
  subscribeId: string;

  @Column({ name: 'subscriber_id', type: 'varchar' })
  subscriberId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
