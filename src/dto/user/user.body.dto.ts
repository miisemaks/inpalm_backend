import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'UserBodyUpdateDto',
})
export class UserBodyUpdateDto {
  @ApiProperty({
    nullable: true,
    type: 'string',
    required: false,
  })
  firstName: string | null;
  @ApiProperty({
    nullable: true,
    type: 'string',
    required: false,
  })
  lastName: string | null;
  @ApiProperty({
    nullable: true,
    type: 'string',
    required: false,
  })
  phone: string | null;
}
