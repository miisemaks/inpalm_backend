import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUser {
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Иван',
    nullable: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Иванов',
    nullable: true,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: '1995-06-15T00:00:00.000Z',
    nullable: true,
  })
  @IsString()
  birthdate: string;
}
