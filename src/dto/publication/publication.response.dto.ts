import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PublicationDto } from './publication.dto';

@ApiSchema({ name: 'PublicationListResponseDto' })
export class PublicationListResponseDto {
  @ApiProperty({ type: [PublicationDto] })
  data: PublicationDto[];
}

@ApiSchema({ name: 'PublicationResponseDto' })
export class PublicationResponseDto {
  @ApiProperty({ type: PublicationDto })
  data: PublicationDto;
}
