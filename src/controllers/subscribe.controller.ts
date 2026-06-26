import {
  Body,
  Controller,
  Get,
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
import { SubscribeCreateBodyDto } from 'src/dto/subscribe/subscribe.body.dto';
import { SubscribeDto } from 'src/dto/subscribe/subscribe.dto';
import {
  SubscribeResponseDto,
  SubscribeUserResponseListDto,
} from 'src/dto/subscribe/subscribe.response.dto';
import { UserBasicDto } from 'src/dto/user/user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { SubscribesService } from 'src/services/subscribe.service';
import type { RequestWithUser } from 'src/types/request-with-user';

@ApiTags({ name: 'Подписка' })
@Controller('api/subscribe')
export class SubscribeController {
  constructor(private readonly service: SubscribesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Создание подписки' })
  @ApiOkResponse({ type: SubscribeResponseDto })
  @ApiBadRequestResponse()
  async createSubscribe(
    @Request() req: RequestWithUser,
    @Body() data: SubscribeCreateBodyDto,
  ): Promise<SubscribeResponseDto> {
    const like = await this.service.create(data, req.user.id);

    return { data: new SubscribeDto(like) };
  }

  @Get('subscribes')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Получить список подписчиков' })
  @ApiOkResponse({ type: SubscribeUserResponseListDto })
  async getUserSubscribes(
    @Request() req: RequestWithUser,
  ): Promise<SubscribeUserResponseListDto> {
    const subscribes = await this.service.getSubscribes(req.user.id);

    return { data: subscribes.map((i) => new UserBasicDto(i)) };
  }
}
