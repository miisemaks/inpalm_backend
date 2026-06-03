import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthGetCodeBodyDto,
  AuthRegisterBodyDto,
  AuthSendCodeNewEmailBodyDto,
  AuthVerifyCodeBodyDto,
  AuthVerifyCodeNewEmailBodyDto,
} from 'src/dto/auth/auth.body.dto';
import {
  AuthGetCodeResponseDto,
  AuthRegisterResponseDto,
  AuthSendCodeNewEmailResponseDto,
  AuthVerifyCodeNewEmailResponseDto,
  AuthVerifyCodeResponseDto,
} from 'src/dto/auth/auth.response.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { AuthService } from 'src/services/auth.service';
import type { RequestWithUser } from 'src/types/request-with-user';

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

  @Post('email/get-code')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Получить код новому email',
  })
  @ApiOkResponse({
    type: AuthSendCodeNewEmailResponseDto,
  })
  async getCodeToNewEmail(
    @Body() data: AuthSendCodeNewEmailBodyDto,
    @Request() req: RequestWithUser,
  ): Promise<AuthSendCodeNewEmailResponseDto> {
    return await this.service.sendCodeToNewEmail(req.user?.id, data.newEmail);
  }

  @Post('email/confirm')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Верификация новой электронной почты',
  })
  @ApiOkResponse({
    type: AuthVerifyCodeNewEmailResponseDto,
  })
  async verifyCodeToNewEmail(
    @Body() data: AuthVerifyCodeNewEmailBodyDto,
    @Request() req: RequestWithUser,
  ): Promise<AuthVerifyCodeNewEmailResponseDto> {
    return await this.service.verifyCodeToNewEmail(
      req.user?.id,
      data.newEmail,
      data.code,
    );
  }
}
