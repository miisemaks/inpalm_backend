import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PublicationBodyCreate } from 'src/dto/publication/publication.body.dto';
import { PublicationDto } from 'src/dto/publication/publication.dto';
import { PublicationResponseDto } from 'src/dto/publication/publication.response.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { PublicationsService } from 'src/services/publication.service';
import type { RequestWithUser } from 'src/types/request-with-user';

@ApiTags({ name: 'Публикации' })
@Controller('api/publications')
export class PublicationController {
  constructor(private readonly service: PublicationsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Создание публикации',
    description: 'Создание публикации авторизованного пользователя',
  })
  @ApiOkResponse({ type: PublicationResponseDto })
  @ApiBadRequestResponse()
  async createPublication(
    @Request() req: RequestWithUser,
    @Body() data: PublicationBodyCreate,
  ): Promise<PublicationResponseDto> {
    const publication = await this.service.create(data, req.user.id);

    return { data: new PublicationDto(publication) };
  }
}
