import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PublicationDto } from './publication.dto';

@ApiSchema({ name: 'PublicationListResponse' })
export class PublicationListResponseDto {
  @ApiProperty({ type: [PublicationDto] })
  data: PublicationDto[];
}

@ApiSchema({ name: 'PublicationResponse' })
export class PublicationResponseDto {
  @ApiProperty({ type: PublicationDto })
  data: PublicationDto;
}
