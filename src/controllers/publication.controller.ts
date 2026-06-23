import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
  PublicationListQuery,
} from 'src/dto/publication/publication.body.dto';
import { PublicationDto } from 'src/dto/publication/publication.dto';
import {
  PublicationListResponseDto,
  PublicationResponseDto,
} from 'src/dto/publication/publication.response.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { PublicationsService } from 'src/services/publication.service';
import type { RequestWithUser } from 'src/types/request-with-user';

@ApiTags({ name: 'Публикации' })
@Controller('api/publications')
export class PublicationController {
  constructor(private readonly service: PublicationsService) {}

  @Get('list')
  @ApiOperation({ summary: 'Получение списка публикации' })
  async getPublicationList(
    @Query() query: PublicationListQuery,
  ): Promise<PublicationListResponseDto> {
    const result = await this.service.find(query);

    return {
      data: result.publications.map((i) => new PublicationDto(i)),
      pagination: result.pagination,
    };
  }

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

  @Get(':id')
  @ApiOperation({
    summary: 'Получение публикации по ID',
  })
  @ApiOkResponse({ type: PublicationResponseDto })
  async getOnePublication(
    @Param('id') id: string,
  ): Promise<PublicationResponseDto> {
    const publication = await this.service.findOne(id);
    return { data: new PublicationDto(publication) };
  }
}
