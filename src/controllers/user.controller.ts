import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorNonAuthResponse } from 'src/dto/error/non-auth.dto';
import { ErrorNotFoundResponse } from 'src/dto/error/not-found.dto';
import { UserBodyUpdateDto } from 'src/dto/user/user.body.dto';
import { UserDto } from 'src/dto/user/user.dto';
import { UserResponseDto } from 'src/dto/user/user.response.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UsersService } from 'src/services/user.service';
import type { RequestWithUser } from 'src/types/request-with-user';

@ApiTags({
  name: 'Пользователь',
})
@ApiBearerAuth()
@Controller('api/users')
export class UserController {
  constructor(private readonly service: UsersService) {}

  @Get('/profile')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Получить профиль пользователя',
  })
  @ApiOkResponse({
    description: 'Возвращает текущего пользователя',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Возвращает ошибку если пользователь не задал токен доступа',
    type: ErrorNonAuthResponse,
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
    type: ErrorNotFoundResponse,
  })
  async getMe(@Request() req: RequestWithUser): Promise<UserResponseDto> {
    const user = await this.service.getUserById(req.user?.id);

    return { data: new UserDto(user) };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить профиль пользователя по id',
  })
  @ApiOkResponse({
    description: 'Возвращает пользователя по id',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Возвращает ошибку если пользователь не задал токен доступа',
    type: ErrorNonAuthResponse,
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
    type: ErrorNotFoundResponse,
  })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.service.getUserById(id);

    return { data: new UserDto(user) };
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Обновляет профиль пользователя',
  })
  @ApiOkResponse({
    description: 'Возвращает текущего пользователя',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Возвращает ошибку если пользователь не задал токен доступа',
    type: ErrorNonAuthResponse,
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
    type: ErrorNotFoundResponse,
  })
  async updateUser(
    @Request() req: RequestWithUser,
    @Body() data: UserBodyUpdateDto,
  ): Promise<UserResponseDto> {
    const user = await this.service.getUserById(req.user?.id);

    const updatedUser = await this.service.update(user.id, data);

    return { data: new UserDto(updatedUser) };
  }

  @Delete('profile')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Удаляет профиль пользователя',
  })
  @ApiOkResponse({
    description: 'Возвращает текущего пользователя',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Возвращает ошибку если пользователь не задал токен доступа',
    type: ErrorNonAuthResponse,
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
    type: ErrorNotFoundResponse,
  })
  async deleteUser(@Request() req: RequestWithUser): Promise<UserResponseDto> {
    const user = await this.service.deleteUser(req.user?.id);

    return { data: new UserDto(user.data) };
  }
}
