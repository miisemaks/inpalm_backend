import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

@ApiSchema({
  name: 'PublicationBodyCreate',
})
export class PublicationBodyCreate {
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

  @ApiProperty({
    type: 'string',
    example: 'ID категории',
    description: 'Заполните UUID категории',
  })
  @IsNotEmpty()
  @IsUUID()
  @MaxLength(255)
  category: string;

  @ApiProperty({
    type: 'string',
    example: 'ID подкатегории',
    description: 'заполните UUID подкатегории',
  })
  @IsNotEmpty()
  @IsUUID()
  @MaxLength(255)
  subcategory: string;
}

export class PublicationBodyEdit {
  @ApiProperty({
    type: 'string',
    example: 'Example',
    nullable: true,
  })
  @IsString()
  @MaxLength(200)
  title: string | null;

  @ApiProperty({
    type: 'string',
    example: 'Content text',
    nullable: true,
  })
  @IsString()
  @MaxLength(1000)
  content: string | null;

  @ApiProperty({
    type: 'string',
    example: 'ID категории',
    description: 'Заполните UUID категории',
    nullable: true,
  })
  @IsUUID()
  @MaxLength(255)
  category: string | null;

  @ApiProperty({
    type: 'string',
    example: 'ID подкатегории',
    description: 'заполните UUID подкатегории',
    nullable: true,
  })
  @IsUUID()
  @MaxLength(255)
  subcategory: string | null;
}
