import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { EUserRole, UserEntity } from 'src/models/user.entity';

@ApiSchema({ name: 'User' })
export class UserDto {
  @ApiProperty({
    type: 'string',
    example: '8e7aa9ab-db3f-47bf-89d2-53a4d6d0a34e',
  })
  id: string;
  @ApiProperty({ enum: EUserRole, default: EUserRole.customer })
  role: EUserRole;
  @ApiProperty({ type: 'string', nullable: true, example: 'Иван' })
  firstName: string | null;
  @ApiProperty({ type: 'string', nullable: true, example: 'Иванов' })
  lastName: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
    example: '+7 (000) 000-00-00',
  })
  @IsPhoneNumber('RU')
  phone: string | null;
  @ApiProperty({ type: 'string', example: 'temp@mail.ru' })
  @IsEmail()
  email: string;
  @ApiProperty({ type: 'string', example: new Date() })
  createdAt: Date;
  @ApiProperty({ type: 'string', example: new Date() })
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
