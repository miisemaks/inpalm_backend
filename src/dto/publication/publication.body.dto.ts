import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'PublicationBodyCreateDto',
})
export class PublicationBodyCreateDto {
  @ApiProperty({
    type: 'string',
    example: 'Example',
  })
  title: string;

  @ApiProperty({
    type: 'string',
    example: 'Content text',
  })
  content: string;
}
