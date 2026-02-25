import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMeAvatar {
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Иван',
    nullable: true,
  })
  @IsString()
  id: string;
}
