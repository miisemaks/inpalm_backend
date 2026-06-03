import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'UserBodyUpdateDto',
})
export class UserBodyUpdateDto {
  @ApiProperty({
    nullable: true,
    type: 'string',
    required: false,
    example: 'Иван',
  })
  firstName: string | null;
  @ApiProperty({
    nullable: true,
    type: 'string',
    required: false,
    example: 'Иванов',
  })
  lastName: string | null;
  @ApiProperty({
    nullable: true,
    type: 'string',
    required: false,
    example: '+7 (000) 000-00-00',
  })
  phone: string | null;
}
