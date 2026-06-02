import { EUserRole, UserEntity } from 'src/models/user.entity';

export class UserDto {
  id: string;
  role: EUserRole;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: UserEntity) {
    this.id = entity.id;
    this.role = entity.role;
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.phone = entity.phone;
    this.email = entity.email;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
