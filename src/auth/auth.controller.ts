import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthLogin, AuthLoginTest } from 'src/auth/dto/auth-login';
import { AuthRegister } from 'src/auth/dto/auth-register';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login_test')
  @HttpCode(HttpStatus.ACCEPTED)
  async login_test(@Body() data: AuthLoginTest) {
    return this.authService.login_test(data);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body()
    data: AuthRegister,
  ) {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Body() data: AuthLogin) {
    return this.authService.login(data.token);
  }
}
