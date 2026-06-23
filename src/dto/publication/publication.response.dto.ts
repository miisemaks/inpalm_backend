import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PublicationDto } from './publication.dto';

@ApiSchema({ name: 'PublicationPaginationResponse' })
export class PublicationPaginationDto {
  @ApiProperty({ type: 'number' })
  perPage: number;

  @ApiProperty({ type: 'number' })
  totalItems: number;

  @ApiProperty({ type: 'number' })
  currentPage: number;

  @ApiProperty({ type: 'number' })
  totalPages: number;

  @ApiProperty({ type: 'boolean' })
  hasNextPage: boolean;
}
@ApiSchema({ name: 'PublicationListResponse' })
export class PublicationListResponseDto {
  @ApiProperty({ type: [PublicationDto] })
  data: PublicationDto[];
  @ApiProperty({ type: PublicationPaginationDto })
  pagination: PublicationPaginationDto;
}

@ApiSchema({ name: 'PublicationResponse' })
export class PublicationResponseDto {
  @ApiProperty({ type: PublicationDto })
  data: PublicationDto;
}
