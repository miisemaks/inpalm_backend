import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LikeCreateBodyDto } from 'src/dto/like/like.body.dto';
import { LikeDto } from 'src/dto/like/like.dto';
import {
  LikePublicationResponseListDto,
  LikeResponseDto,
  LikeResponseListDto,
} from 'src/dto/like/like.response.dto';
import { UserBasicDto } from 'src/dto/user/user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { LikesService } from 'src/services/like.service';
import type { RequestWithUser } from 'src/types/request-with-user';

@ApiTags({ name: 'Лайки' })
@Controller('api/like')
export class LikeController {
  constructor(private readonly service: LikesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Создание лайка',
    description: 'Создание лайка авторизованного пользователя',
  })
  @ApiOkResponse({ type: LikeResponseDto })
  @ApiBadRequestResponse()
  async createPublication(
    @Request() req: RequestWithUser,
    @Body() data: LikeCreateBodyDto,
  ): Promise<LikeResponseDto> {
    const like = await this.service.create(data, req.user.id);

    return { data: new LikeDto(like) };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Удаление публикации',
  })
  @ApiOkResponse({ type: LikeResponseDto })
  @ApiBadRequestResponse()
  async deletePublication(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<LikeResponseDto> {
    const like = await this.service.delete(id, req.user.id);
    return { data: new LikeDto(like) };
  }

  @Get('likes/publication/:id')
  @ApiOperation({ summary: 'Получение лайков публикации' })
  @ApiOkResponse({
    type: LikePublicationResponseListDto,
  })
  async getPublicationLikes(
    @Param('id') id: string,
  ): Promise<LikePublicationResponseListDto> {
    const likes = await this.service.findPublicationLikes(id);

    return { data: likes.map((i) => new UserBasicDto(i)) };
  }

  @Get('likes/user/:id')
  @ApiOperation({ summary: 'Получение лайков пользователя' })
  @ApiOkResponse({
    type: LikeResponseListDto,
  })
  async getUserLikes(@Param('id') id: string): Promise<LikeResponseListDto> {
    const likes = await this.service.findUserLikes(id);

    return { data: likes.map((i) => new LikeDto(i)) };
  }
}
