import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { PublicationEntity } from './publication.entity';

export enum EUserRole {
  customer = 'customer',
  courier = 'courier',
  admin = 'admin',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, name: 'first_name', type: 'varchar' })
  firstName: string | null;

  @Column({ nullable: true, name: 'last_name', type: 'varchar' })
  lastName: string | null;

  @Column({ enum: EUserRole, default: EUserRole.customer })
  role: EUserRole;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  phone: string | null;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, name: 'login_code', type: 'varchar' })
  loginCode: string | null;

  @Column({ nullable: true, name: 'code_expires', type: 'varchar' })
  codeExpires: string | null;

  @OneToMany(() => RefreshTokenEntity, (item) => item.user)
  refreshTokens: RefreshTokenEntity[];

  @OneToMany(() => PublicationEntity, (item) => item.author)
  publications: PublicationEntity[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
