import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthGetCodeBodyDto,
  AuthRegisterBodyDto,
  AuthVerifyCodeBodyDto,
} from 'src/dto/auth/auth.body.dto';
import {
  AuthGetCodeResponseDto,
  AuthRegisterResponseDto,
  AuthVerifyCodeResponseDto,
} from 'src/dto/auth/auth.response.dto';
import { AuthService } from 'src/services/auth.service';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('get-code')
  @ApiOperation({
    summary: 'Получить код по email',
  })
  @ApiOkResponse({
    type: AuthGetCodeResponseDto,
  })
  async getCode(
    @Body() data: AuthGetCodeBodyDto,
  ): Promise<AuthGetCodeResponseDto> {
    return this.service.getCode(data.email);
  }

  @Post('verify-code')
  @ApiOperation({
    summary: 'Проверить код',
  })
  @ApiOkResponse({
    type: AuthVerifyCodeResponseDto,
  })
  async verifyCode(
    @Body() data: AuthVerifyCodeBodyDto,
  ): Promise<AuthVerifyCodeResponseDto> {
    const response = await this.service.verifyCode(data.email, data.code);
    return {
      access_token: response.accessToken,
      refresh_token: response.token,
      user: response.user,
    };
  }

  @Post('register')
  @ApiOperation({
    summary: 'Регистрация пользователя',
  })
  @ApiOkResponse({
    type: AuthRegisterResponseDto,
  })
  async register(
    @Body() data: AuthRegisterBodyDto,
  ): Promise<AuthRegisterResponseDto> {
    return await this.service.register(data);
  }
}
