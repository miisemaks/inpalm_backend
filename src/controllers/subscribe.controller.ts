import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SubscribeCreateBodyDto } from 'src/dto/subscribe/subscribe.body.dto';
import { SubscribeDto } from 'src/dto/subscribe/subscribe.dto';
import { SubscribeResponseDto } from 'src/dto/subscribe/subscribe.response.dto';
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
}
