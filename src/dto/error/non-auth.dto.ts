import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'ErrorNonAuthResponse',
})
export class ErrorNonAuthResponse {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  message: string;

  @ApiProperty({ example: 'Invalid or missing JWT token' })
  error: string;
}
