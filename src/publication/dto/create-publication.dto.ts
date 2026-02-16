import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePublicationDto {
  @ApiProperty({
    description: 'Заголовок публикации',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Содержание публикации',
  })
  @IsString()
  @MinLength(3)
  content: string;
}
