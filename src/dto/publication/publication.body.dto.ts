import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@ApiSchema({
  name: 'PublicationBodyCreateDto',
})
export class PublicationBodyCreateDto {
  @ApiProperty({
    type: 'string',
    example: 'Example',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    type: 'string',
    example: 'Content text',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
