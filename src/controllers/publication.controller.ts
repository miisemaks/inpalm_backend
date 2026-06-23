import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  PublicationBodyCreate,
  PublicationBodyEdit,
} from 'src/dto/publication/publication.body.dto';
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

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Редактирование публикации',
    description:
      'В поле data указывайте только те параметры, которые хотите изменить',
  })
  @ApiOkResponse({ type: PublicationResponseDto })
  @ApiBadRequestResponse()
  async editPublication(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: PublicationBodyEdit,
  ): Promise<PublicationResponseDto> {
    const publication = await this.service.edit(id, data, req.user.id);
    return { data: new PublicationDto(publication) };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Удаление публикации',
  })
  @ApiOkResponse({ type: PublicationResponseDto })
  @ApiBadRequestResponse()
  async deletePublication(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<PublicationResponseDto> {
    const publication = await this.service.delete(id, req.user.id);
    return { data: new PublicationDto(publication) };
  }
}
