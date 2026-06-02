import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'ErrorNotFoundResponse',
})
export class ErrorNotFoundResponse {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Not Found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
